import { IDataResult, DataResult, ErrorDataResult, SuccessDataResult } from '../core/results/DataResult';
import { Login } from '../core/types/Login'
import { Token } from '../core/types/Token'
import { TokenPayload } from '../core/types/TokenPayload';
import { User } from '../types/User';

import JWTService from '../core/services/jwt.service'
import EncryptionService from '../core/services/encryption.service';

import UserService from './user.service'


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



// ---------- ---------- business rules ---------- ----------


// ---------- ---------- ---------- ---------- ----------


const LoginService = { login };
export default LoginService;

