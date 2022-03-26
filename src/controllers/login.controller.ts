import { LoginService } from "../services/login.service"

async function login(req: any, res: any, next: any) {
    try {
        res.json(await LoginService.login(req.body));
    } catch (err: any) {
        console.error(`Error`, err.message);
        next(err);
    }
}

export const LoginController = {
    login
};

