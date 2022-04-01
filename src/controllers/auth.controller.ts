import AuthService from "../services/auth.service"

async function login(req: any, res: any, next: any) {
    try {
        res.json(await AuthService.login(req.body));
    } catch (err: any) {
        console.error(`Error`, err.message);
        next(err);
    }
}

async function signUp(req: any, res: any, next: any) {
    try {
        res.json(await AuthService.signUp(req.body));
    } catch (err: any) {
        console.error(`Error`, err.message);
        next(err);
    }
}

async function sendVerification(req: any, res: any, next: any) {
    try {
        res.json(await AuthService.sendVerification(req.params.email));
    } catch (err: any) {
        console.error(`Error`, err.message);
        next(err);
    }
}

async function verify(req: any, res: any, next: any) {
    try {
        res.json(await AuthService.verify(req.body));
    } catch (err: any) {
        console.error(`Error`, err.message);
        next(err);
    }
}


const AuthController = { login, signUp, sendVerification, verify };
export default AuthController;

