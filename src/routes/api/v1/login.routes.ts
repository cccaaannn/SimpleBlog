import { Router } from 'express';
import LoginController from '../../../controllers/login.controller';

const LoginRouter = Router();

LoginRouter.post('/login', LoginController.login);

LoginRouter.post('/signUp', LoginController.signUp);

export default LoginRouter;
