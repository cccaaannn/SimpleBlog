import { IDataResult, DataResult, ErrorDataResult, SuccessDataResult } from '../core/results/DataResult';
import { Login } from '../core/types/Login'
import { Token } from '../core/types/Token'
import { TokenPayload } from '../core/types/TokenPayload';
import { User, UserAdd } from '../types/User';

import JWTService from '../core/services/jwt.service'
import EncryptionService from '../core/services/encryption.service';

import UserService from './user.service'
import { IResult, SuccessResult } from '../core/results/Result';
import { SignUp } from '../core/types/SignUp';


async function login(login: Login): Promise<IDataResult<Token | null>> {
    const userResult: DataResult<User | null> = await UserService.getByUsername(login.username);

    if (userResult == null || userResult.data == null || !userResult.status) {
        return new ErrorDataResult(null, "Login failed");
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

    const token: Token = { token: JWTService.generateToken(tokenPayload) }

    return new SuccessDataResult(token)
}


async function signUp(signUp: SignUp): Promise<IResult> {

    const user: UserAdd = {
        email: signUp.email,
        username: signUp.username,
        password: signUp.password
    }

    const userAddResult: IResult = await UserService.add(user);
    if(!userAddResult.status) {
        return userAddResult;
    }

    return new SuccessResult("User successfully created")
}



// ---------- ---------- business rules ---------- ----------


// ---------- ---------- ---------- ---------- ----------


const LoginService = { login, signUp };
export default LoginService;

