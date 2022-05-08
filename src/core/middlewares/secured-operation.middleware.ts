import { Request, Response, NextFunction } from 'express';
import JWTService from "../services/jwt.service"
import { DataResult } from "../results/DataResult";
import { ErrorResult } from "../results/Result";
import { Token } from "../types/Token";
import { TokenPayload } from "../types/TokenPayload";
import Roles from "../types/enums/Roles";
import TokenType from '../types/enums/TokenType';


function extractTokenIfExists() {
    // Extracts token in to 'res.locals.token'
    return async function (req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers['authorization']
        const tokenHeader = authHeader && authHeader.split(' ')[1]

        // If bearer token is not exits
        if (tokenHeader == null) {
            res.locals.token = null;
        }
        else {
            const token: Token = { token: tokenHeader }
            // save token to res.locals so following middle-wares can use it
            res.locals.token = token;
        }
        
        next();
    }
}

function decodeTokenIfExists() {
    // tokenPayload might be null, this function only tries to decode token not verifies it
    return async function (req: Request, res: Response, next: NextFunction) {
        const token: Token = res.locals.token

        if (token == null) {
            return next();
        }

        const verificationResult: DataResult<TokenPayload | null> = await JWTService.verify(token);
        res.locals.tokenPayload = verificationResult.data;

        next();
    }
}

function decodeAndVerifyToken() {
    // Requires extracted token in 'res.locals.token'
    return async function (req: Request, res: Response, next: NextFunction) {
        const token: Token = res.locals.token

        if (token == null) {
            return res.status(401).json(new ErrorResult("Not authorized"))
        }

        const verificationResult: DataResult<TokenPayload | null> = await JWTService.verify(token);

        // If token is not verified
        if (verificationResult == null || verificationResult.data == null || !verificationResult.status) {
            return res.status(403).json(new ErrorResult(verificationResult.message))
        }

        // Wrong token type
        if(verificationResult.data.type != TokenType.AUTH) {
            return res.status(403).json(new ErrorResult("Invalid token provided"))
        }
        
        res.locals.tokenPayload = verificationResult.data;

        next();
    }
}

function allowForRoles(acceptedRoles: Roles[]) {
    // Requires tokenPayload in 'res.locals.tokenPayload'
    return async function(req: Request, res: Response, next: NextFunction) {
        const userRole: string = res.locals.tokenPayload.role.toUpperCase();
        if(acceptedRoles && !acceptedRoles.some(role => role === userRole)) {
            return res.status(403).json(new ErrorResult("Not authorized"))
        }
        next();
    }
}

export { allowForRoles, extractTokenIfExists, decodeTokenIfExists, decodeAndVerifyToken };
