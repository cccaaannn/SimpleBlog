// Project imports
import { IResult } from "../core/results/Result";
import { Token } from "../core/types/Token";
import AuthService from "../services/auth.service"


async function login(req: any, res: any, next: any) {
    try {
        const result: IResult = await AuthService.login(req.body);
        if (result.status) {
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
        if (result.status) {
            return res.status(200).json(result);
        }
        return res.status(400).json(result);
    }
    catch (err: any) {
        res.locals.err = err;
        next();
    }
}

async function sendAccountVerification(req: any, res: any, next: any) {
    try {
        const result: IResult = await AuthService.sendAccountVerification(req.params.email);
        if (result.status) {
            return res.status(200).json(result);
        }
        return res.status(400).json(result);
    }
    catch (err: any) {
        res.locals.err = err;
        next();
    }
}

async function verifyAccount(req: any, res: any, next: any) {
    try {
        const result: IResult = await AuthService.verifyAccount(req.body);
        if (result.status) {
            return res.status(200).json(result);
        }
        return res.status(400).json(result);
    }
    catch (err: any) {
        res.locals.err = err;
        next();
    }
}

async function sendPasswordReset(req: any, res: any, next: any) {
    try {
        const result: IResult = await AuthService.sendPasswordReset(req.params.email);
        if (result.status) {
            return res.status(200).json(result);
        }
        return res.status(400).json(result);
    }
    catch (err: any) {
        res.locals.err = err;
        next();
    }
}

async function resetPassword(req: any, res: any, next: any) {
    try {
        const token: Token = { token: req.body.token }
        const result: IResult = await AuthService.resetPassword(token, req.body.password);
        if (result.status) {
            return res.status(200).json(result);
        }
        return res.status(400).json(result);
    }
    catch (err: any) {
        res.locals.err = err;
        next();
    }
}

const AuthController = { login, signUp, sendAccountVerification, verifyAccount, sendPasswordReset, resetPassword };
export default AuthController;

