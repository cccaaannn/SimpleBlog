import { Router } from 'express';
import AuthController from '../../../controllers/auth.controller';

const AuthRouter = Router();

AuthRouter.post('/login', AuthController.login);

AuthRouter.post('/signUp', AuthController.signUp);

AuthRouter.get('/sendVerification/:email', AuthController.sendVerification);

AuthRouter.post('/verify', AuthController.verify);

export default AuthRouter;
