import LoginService from "../services/login.service"

async function login(req: any, res: any, next: any) {
    try {
        res.json(await LoginService.login(req.body));
    } catch (err: any) {
        console.error(`Error`, err.message);
        next(err);
    }
}

async function signUp(req: any, res: any, next: any) {
    try {
        res.json(await LoginService.signUp(req.body));
    } catch (err: any) {
        console.error(`Error`, err.message);
        next(err);
    }
}

async function verify(req: any, res: any, next: any) {
    try {
        res.json(await LoginService.verify(req.body));
    } catch (err: any) {
        console.error(`Error`, err.message);
        next(err);
    }
}


const LoginController = { login, signUp, verify };
export default LoginController;

