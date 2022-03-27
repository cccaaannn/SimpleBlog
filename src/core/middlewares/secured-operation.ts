import JWTService from "../services/jwt.service"
import { DataResult } from "../results/DataResult";
import { ErrorResult } from "../results/Result";
import { Token } from "../types/Token";
import { TokenPayload } from "../types/TokenPayload";
import Roles from "../../types/enums/Roles";

function allowForRoles(acceptedRoles?: Roles[]) {
    return async function(req: any, res: any, next: any) {
        const authHeader = req.headers['authorization']
        const tokenHeader = authHeader && authHeader.split(' ')[1]
        
        // If bearer token is not exits
        if (tokenHeader == null) {
            return res.status(401).json(new ErrorResult("Not authorized"))
        }
        const token: Token = { token: tokenHeader }

        const verificationResult: DataResult<TokenPayload | null> = await JWTService.verify(token);
        console.log(verificationResult.data);
        
        // If token is not verified
        if (verificationResult == null || verificationResult.data == null || !verificationResult.status) {
            return res.status(403).json(new ErrorResult(verificationResult.message))
        }
        // If token is valid but does not contains acceptedRole. (If acceptedRole is not provided this 'if' does not works)
        else {
            const userRole: string = verificationResult.data.role.toUpperCase();
            if(acceptedRoles && !acceptedRoles.some(role => role === userRole)) {
                return res.status(403).json(new ErrorResult("Not authorized"))
            }
        }

        next();
    }
}


function allowForUserId() {
    return async function(req: any, res: any, next: any) {
        if(!req.params.userId) {
            return res.status(401).json(new ErrorResult("Not authorized"))
        }
        const authHeader = req.headers['authorization']
        const tokenHeader = authHeader && authHeader.split(' ')[1]
        
        // If bearer token is not exits
        if (tokenHeader == null) {
            return res.status(401).json(new ErrorResult("Not authorized"))
        }
        const token: Token = { token: tokenHeader }

        const verificationResult: DataResult<TokenPayload | null> = await JWTService.verify(token);
        console.log(verificationResult.data);
        
        // If token is not verified
        if (verificationResult == null || verificationResult.data == null || !verificationResult.status) {
            return res.status(403).json(new ErrorResult(verificationResult.message))
        }
        // If token is valid but does not contains acceptedRole. (If acceptedRole is not provided this 'if' does not works)
        else {
            const userId: string = verificationResult.data.id;
            if(userId != req.params.userId) {
                return res.status(403).json(new ErrorResult("Not authorized"))
            }
        }

        next();
    }
}


export { allowForRoles, allowForUserId };
