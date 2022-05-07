import { Router } from 'express';
import AuthController from '../../../controllers/auth.controller';
import { bodyTrimer } from '../../../core/middlewares/body-trimer.middleware';

const AuthRouter = Router();

AuthRouter.post('/login', bodyTrimer(), AuthController.login);

AuthRouter.post('/signUp', bodyTrimer(), AuthController.signUp);

AuthRouter.get('/sendAccountVerification/:email', AuthController.sendAccountVerification);

AuthRouter.post('/verifyAccount', AuthController.verifyAccount);

AuthRouter.get('/sendPasswordReset/:email', AuthController.sendPasswordReset);

AuthRouter.post('/resetPassword', AuthController.resetPassword);

export default AuthRouter;
