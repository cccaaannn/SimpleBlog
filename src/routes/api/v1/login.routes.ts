import { Router } from 'express';
import LoginController from '../../../controllers/login.controller';

const LoginRouter = Router();

LoginRouter.post('/', LoginController.login);

export default LoginRouter;
