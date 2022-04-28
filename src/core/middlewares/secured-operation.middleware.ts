import { Request, Response, NextFunction } from 'express';
import JWTService from "../services/jwt.service"
import { DataResult } from "../results/DataResult";
import { ErrorResult } from "../results/Result";
import { Token } from "../types/Token";
import { TokenPayload } from "../types/TokenPayload";
import Roles from "../types/enums/Roles";


function extractAndValidateToken() {
    return async function (req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers['authorization']
        const tokenHeader = authHeader && authHeader.split(' ')[1]

        // If bearer token is not exits
        if (tokenHeader == null) {
            return res.status(401).json(new ErrorResult("Not authorized"))
        }
        const token: Token = { token: tokenHeader }

        const verificationResult: DataResult<TokenPayload | null> = await JWTService.verify(token);
        // console.log(verificationResult.data);

        // If token is not verified
        if (verificationResult == null || verificationResult.data == null || !verificationResult.status) {
            return res.status(403).json(new ErrorResult(verificationResult.message))
        }

        // save token to res.locals so following middlewares can use it
        res.locals.token = token;
        res.locals.tokenPayload = verificationResult.data;

        next();
    }
}

function allowForRoles(acceptedRoles: Roles[]) {
    return async function(req: Request, res: Response, next: NextFunction) {
        const userRole: string = res.locals.tokenPayload.role.toUpperCase();
        if(acceptedRoles && !acceptedRoles.some(role => role === userRole)) {
            return res.status(403).json(new ErrorResult("Not authorized"))
        }
        next();
    }
}

export { allowForRoles, extractAndValidateToken };
