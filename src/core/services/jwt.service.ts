import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { DataResult, ErrorDataResult, SuccessDataResult } from '../results/DataResult';
import { Token } from '../types/Token';
import { TokenPayload } from '../types/TokenPayload';

function generateToken(tokenPayload: TokenPayload) {
    return jwt.sign({ tokenPayload }, process.env.JWT_PRIVATE_KEY as string, { expiresIn: process.env.JWT_EXPIRATION as string});
}

async function verify(token: Token): Promise<DataResult<TokenPayload|null>> {
    try {
        const tokenData: any = await jwt.verify(token.token, process.env.JWT_PRIVATE_KEY as string);
        const tokenPayload: TokenPayload = tokenData.tokenPayload as TokenPayload;
        return new SuccessDataResult(tokenPayload);
    }
    catch(err){
        console.log(err);
        let message: string = "Not authorized";

        if(err instanceof TokenExpiredError) {
            message = "Token expired"
        } 
        else if(err instanceof JsonWebTokenError) {
            message = "Not authorized"
        }

        return new ErrorDataResult(null, message);
    }
}


const JWTService = { generateToken, verify }
export default JWTService;
