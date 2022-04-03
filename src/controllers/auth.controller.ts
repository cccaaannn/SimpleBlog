// Project imports
import { IResult } from "../core/results/Result";
import AuthService from "../services/auth.service"

async function login(req: any, res: any, next: any) {
    try {
        const result: IResult = await AuthService.login(req.body);
        if(result.status) {
            return res.status(200).json(result);
        }
        return res.status(400).json(result);
    } 
    catch (err: any) {
        res.locals.err = err;
        next();
    }
}

async function signUp(req: any, res: any, next: any) {
    try {
        const result: IResult = await AuthService.signUp(req.body);
        if(result.status) {
            return res.status(200).json(result);
        }
        return res.status(400).json(result);
    } 
    catch (err: any) {
        res.locals.err = err;
        next();
    }
}

async function sendVerification(req: any, res: any, next: any) {
    try {
        const result: IResult = await AuthService.sendVerification(req.params.email);
        if(result.status) {
            return res.status(200).json(result);
        }
        return res.status(400).json(result);
    } 
    catch (err: any) {
        res.locals.err = err;
        next();
    }
}

async function verify(req: any, res: any, next: any) {
    try {
        const result: IResult = await AuthService.verify(req.body);
        if(result.status) {
            return res.status(200).json(result);
        }
        return res.status(400).json(result);
    } 
    catch (err: any) {
        res.locals.err = err;
        next();
    }
}


const AuthController = { login, signUp, sendVerification, verify };
export default AuthController;

