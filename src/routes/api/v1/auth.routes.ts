import { Router } from 'express';
import AuthController from '../../../controllers/auth.controller';

const AuthRouter = Router();

AuthRouter.post('/login', AuthController.login);

AuthRouter.post('/signUp', AuthController.signUp);

AuthRouter.get('/sendAccountVerification/:email', AuthController.sendAccountVerification);

AuthRouter.post('/verifyAccount', AuthController.verifyAccount);

AuthRouter.get('/sendPasswordReset/:email', AuthController.sendPasswordReset);

AuthRouter.post('/resetPassword', AuthController.resetPassword);

export default AuthRouter;
