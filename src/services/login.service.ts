import { IDataResult, DataResult, ErrorDataResult, SuccessDataResult } from '../core/results/DataResult';
import { Login } from '../core/types/Login'
import { Token } from '../core/types/Token'
import { TokenPayload } from '../core/types/TokenPayload';
import { User, UserAdd } from '../types/User';

import JWTService from '../core/services/jwt.service'
import EncryptionService from '../core/services/encryption.service';

import UserService from './user.service'
import { ErrorResult, IResult, SuccessResult } from '../core/results/Result';
import { SignUp } from '../core/types/SignUp';
import Status from '../types/enums/Status';
import { EmailService } from '../core/services/email.service';

const emailService = new EmailService();


async function login(login: Login): Promise<IDataResult<Token | null>> {
    const userResult: DataResult<User | null> = await UserService.getByUsername(login.username);

    if (userResult == null || userResult.data == null || !userResult.status) {
        return new ErrorDataResult(null, "Login failed");
    }

    if(userResult.data.status == Status.PASSIVE) {
        return new ErrorDataResult(null, "User is inactive");
    }

    const user: User = userResult.data;
    if (!await EncryptionService.compare(login.password, user.password)) {
        return new ErrorDataResult(null, "Login failed");
    }

    const tokenPayload: TokenPayload = {
        id: user._id + "",
        status: user.status,
        username: user.username,
        email: user.email,
        role: user.role
    }

    const token: Token = JWTService.generateToken(tokenPayload);

    return new SuccessDataResult(token)
}


async function signUp(signUp: SignUp): Promise<IResult> {

    // build user model
    const user: UserAdd = {
        email: signUp.email,
        username: signUp.username,
        password: signUp.password
    }

    // try to add user
    const userAddResult: IDataResult<User|null> = await UserService.add(user);
    if (userAddResult == null || userAddResult.data == null || !userAddResult.status) {
        return new ErrorResult(userAddResult.message);
    }
    
    // build token payload for verification email
    const tokenPayload: TokenPayload = {
        id: userAddResult.data._id + "",
        email: userAddResult.data.email,
        role: userAddResult.data.role,
        status: userAddResult.data.status,
        username: userAddResult.data.username
    }
    const token: Token = JWTService.generateToken(tokenPayload)
    console.info(token);

    const to = userAddResult.data.email;
    const subject = "Verify me";
    const text = `Please visit this link to verify your account.\n${process.env.FRONTEND_URL}${process.env.FRONTEND_EMAIL_VERIFY_PATH}${token.token}`;
    const html = `<a href="${process.env.FRONTEND_URL}${process.env.FRONTEND_EMAIL_VERIFY_PATH}${token.token}">Verify your account</a>`

    emailService.send(to, subject, text, html);


    return new SuccessResult(`Activation email sent to ${to}, pending for verification`)
}


async function verify(token: Token): Promise<IResult> {

    // verify token
    const verificationResult: IDataResult<TokenPayload | null> = await JWTService.verify(token);
    if (verificationResult == null || verificationResult.data == null || !verificationResult.status) {
        return new ErrorResult("Account verification failed");
    }

    // get payload
    const tokenPayload: TokenPayload = verificationResult.data;

    // get user using id from payload
    const userResult: DataResult<User|null>  = await UserService.getById(tokenPayload.id);
    if (userResult == null || userResult.data == null || !userResult.status) {
        return new ErrorResult("Account verification failed");
    }

    // fail if already active
    if (userResult.data.status == Status.ACTIVE) {
        return new ErrorResult("Account is already active");
    }

    // activate users account
    const userActivationResult: IResult = await UserService.activate(tokenPayload.id);
    if(!userActivationResult.status) {
        return new ErrorResult("Account activation failed");
    }

    return new SuccessResult("Account successfully activated")
}


// ---------- ---------- business rules ---------- ----------


// ---------- ---------- ---------- ---------- ----------


const LoginService = { login, signUp, verify };
export default LoginService;

