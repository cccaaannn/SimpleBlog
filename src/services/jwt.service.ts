import jwt from 'jsonwebtoken';
import { TokenPayload } from '../types/TokenPayload';

function generateToken(tokenPayload: TokenPayload) {
    return jwt.sign({ tokenPayload }, process.env.JWT_PRIVATE_KEY || "", { expiresIn: process.env.JWT_EXPIRATION });
}


export { generateToken }
