// Project imports
import EmailAuthService from './email-auth.service';
import EncryptionService from '../core/services/encryption.service';
import JWTService from '../core/services/jwt.service';
import UserService from './user.service';

import { IDataResult, DataResult, ErrorDataResult, SuccessDataResult } from '../core/results/DataResult';
import { ErrorResult, IResult, SuccessResult } from '../core/results/Result';
import { Login } from '../core/types/Login';
import { Token } from '../core/types/Token';
import { SignUp } from '../core/types/SignUp';
import { TokenPayload } from '../core/types/TokenPayload';

import Status from '../core/types/enums/Status';
import { User, UserAdd, UserUpdate } from '../types/User';
import TokenType from '../core/types/enums/TokenType';
import RecaptchaService from '../core/services/recaptcha.service'


async function login(login: Login): Promise<IDataResult<Token | null>> {

    // Recaptcha
    const recaptchaResult =  await RecaptchaService.verify(login.captcha);
    if(!recaptchaResult.status) {
        return new ErrorDataResult(null, recaptchaResult.message);
    }

    const userResult: DataResult<User | null> = await UserService.getByUsername(login.username);

    if (userResult == null || userResult.data == null || !userResult.status) {
        return new ErrorDataResult(null, "Login failed");
    }

    if (userResult.data.status == Status.PASSIVE) {
        return new ErrorDataResult(null, "User is pending for activation");
    }

    if (userResult.data.status == Status.SUSPENDED) {
        return new ErrorDataResult(null, "User is suspended");
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
        role: user.role,
        type: TokenType.AUTH
    }

    const token: Token = JWTService.generateToken(tokenPayload);

    return new SuccessDataResult(token)
}

async function signUp(signUp: SignUp): Promise<IResult> {

    // Recaptcha
    const recaptchaResult =  await RecaptchaService.verify(signUp.captcha);
    if(!recaptchaResult.status) {
        return new ErrorResult(recaptchaResult.message);
    }

    // build user model
    const user: UserAdd = {
        email: signUp.email,
        username: signUp.username,
        password: signUp.password
    }

    // try to add user
    const userAddResult: IDataResult<User | null> = await UserService.add(user);
    if (userAddResult == null || userAddResult.data == null || !userAddResult.status) {
        return new ErrorResult(userAddResult.message);
    }

    // async email sent
    EmailAuthService.sendAccountVerificationEmail(userAddResult.data._id);

    return new SuccessResult(`Email sent to ${signUp.email}`);
}

async function sendAccountVerification(email: string): Promise<IResult> {
    // Get user information
    const userResult: DataResult<User | null> = await UserService.getByEmail(email);
    if (userResult == null || userResult.data == null || !userResult.status) {
        return new ErrorResult("User not exists");
    }
    
    if (userResult.data.status == Status.SUSPENDED) {
        return new ErrorResult("User is suspended");
    }

    // Prevent unnecessary email sending
    if(userResult.data.status == Status.ACTIVE) {
        return new ErrorResult("User is already active");
    }

    // async email sent
    EmailAuthService.sendAccountVerificationEmail(userResult.data._id);

    return new SuccessResult(`Email sent to ${email}`);
}

async function verifyAccount(token: Token): Promise<IResult> {
    // verify token
    const verificationResult: IDataResult<TokenPayload | null> = await JWTService.verify(token);
    if (verificationResult == null || verificationResult.data == null || !verificationResult.status) {
        return new ErrorResult("Account verification failed");
    }

    // get payload
    const tokenPayload: TokenPayload = verificationResult.data;

    // Check toke type
    if(tokenPayload.type != TokenType.VERIFY) {
        return new ErrorResult("Invalid token provided");
    }

    // get user using id from payload
    const userResult: DataResult<User | null> = await UserService.getById(tokenPayload.id);
    if (userResult == null || userResult.data == null || !userResult.status) {
        return new ErrorResult("Account verification failed");
    }

    if (userResult.data.status == Status.SUSPENDED) {
        return new ErrorResult("User is suspended");
    }

    // fail if already active
    if (userResult.data.status == Status.ACTIVE) {
        return new ErrorResult("Account is already active");
    }

    // activate users account
    const userActivationResult: IResult = await UserService.activate(tokenPayload.id);
    if (!userActivationResult.status) {
        return new ErrorResult("Account activation failed");
    }

    return new SuccessResult("Account successfully activated")
}

async function sendPasswordReset(email: string): Promise<IResult> {
    // Get user information
    const userResult: DataResult<User | null> = await UserService.getByEmail(email);
    if (userResult == null || userResult.data == null || !userResult.status) {
        return new ErrorResult("User not exists");
    }

    if (userResult.data.status == Status.SUSPENDED) {
        return new ErrorResult("User is suspended");
    }

    // Inactive users can not change password
    if(userResult.data.status == Status.PASSIVE) {
        return new ErrorResult("User is not activated");
    }

    // async email sent
    EmailAuthService.sendPasswordResetEmail(userResult.data._id);

    return new SuccessResult(`Email sent to ${email}`);
}

async function resetPassword(token: Token, newPassword: string): Promise<IResult> {
    // verify token
    const verificationResult: IDataResult<TokenPayload | null> = await JWTService.verify(token);
    if (verificationResult == null || verificationResult.data == null || !verificationResult.status) {
        return new ErrorResult("Password reset failed");
    }

    // get payload
    const tokenPayload: TokenPayload = verificationResult.data;

    // Check toke type
    if(tokenPayload.type != TokenType.RESET) {
        return new ErrorResult("Invalid token provided");
    }

    // get user using id from payload
    const userResult: DataResult<User | null> = await UserService.getById(tokenPayload.id);
    if (userResult == null || userResult.data == null || !userResult.status) {
        return new ErrorResult("Password reset failed");
    }

    if (userResult.data.status != Status.ACTIVE) {
        return new ErrorResult("Can not reset password of a non active user");
    }

    const userToUpdate: UserUpdate = {
        username: tokenPayload.username,
        password: newPassword
    }

    // change password
    // There is a little trick here, UserService.update expects a tokenPayload no matter the type since type is checked on middle-ware we can use reset token here.
    const userActivationResult: IResult = await UserService.update(tokenPayload.id, userToUpdate, tokenPayload);
    if (!userActivationResult.status) {
        return new ErrorResult("Password reset failed");
    }

    return new SuccessResult("Password reset successful");
}


// ---------- ---------- business rules ---------- ----------


// ---------- ---------- ---------- ---------- ----------


const AuthService = { login, signUp, sendAccountVerification, verifyAccount, sendPasswordReset, resetPassword };
export default AuthService;

