import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { DataResult, ErrorDataResult, SuccessDataResult } from '../results/DataResult';
import { Token } from '../types/Token';
import { TokenPayload } from '../types/TokenPayload';
import dotenv from "dotenv";
dotenv.config();

function generateToken(tokenPayload: TokenPayload, expiration?: string): Token {
    const tokenStr = jwt.sign({ tokenPayload }, process.env.JWT_PRIVATE_KEY as string, { expiresIn: expiration || process.env.JWT_USER_TOKEN_EXPIRATION as string });
    return { token: tokenStr };
}

async function verify(token: Token): Promise<DataResult<TokenPayload | null>> {
    try {
        const tokenData: any = await jwt.verify(token.token, process.env.JWT_PRIVATE_KEY as string);
        const tokenPayload: TokenPayload = tokenData.tokenPayload as TokenPayload;
        return new SuccessDataResult(tokenPayload);
    }
    catch (err) {
        console.log(err);
        let message: string = "Not authorized";

        if (err instanceof TokenExpiredError) {
            message = "Token expired"
        }
        else if (err instanceof JsonWebTokenError) {
            message = "Not authorized"
        }

        return new ErrorDataResult(null, message);
    }
}


const JWTService = { generateToken, verify }
export default JWTService;
