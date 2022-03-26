import { DataResult, ErrorDataResult, SuccessDataResult } from '../Results/DataResult';
import { Result } from '../Results/Result';
import { Login } from '../types/Login'
import { Token } from '../types/Token'
import { TokenPayload } from '../types/TokenPayload';
import { User } from '../types/User';

import { generateToken } from './jwt.service'

import { UserService } from './user.service'

import { EncryptionService } from './encryption.service';


async function login(login: Login): Promise<DataResult<Token | null>> {
    const userResult: DataResult<User | null> = await UserService.getByUsername(login.username);

    if (userResult == null || userResult.data == null || !userResult.status) {
        return new ErrorDataResult(null, "Login failed");
    }

    const user: User = userResult.data;
    if(!await EncryptionService.compare(login.password, user.password)) {
        return new ErrorDataResult(null, "Login failed");
    }

    let id: string|null = null;
    if(user._id) {
        id = user._id+"";
    }

    const tokenPayload: TokenPayload = {
        id: id,
        status: user.status,
        username: user.username,
        email: user.email,
        role: user.role
    }

    const token: Token = { token: generateToken(tokenPayload) }

    return new SuccessDataResult(token)
}



// ---------- ---------- business rules ---------- ----------


// ---------- ---------- ---------- ---------- ----------



export const LoginService = {
    login
};

