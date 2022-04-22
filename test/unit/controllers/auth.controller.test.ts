import { getMockReq, getMockRes } from '@jest-mock/express'
import AuthController from '../../../src/controllers/auth.controller';

import { ErrorDataResult, SuccessDataResult } from "../../../src/core/results/DataResult";
import { ErrorResult, SuccessResult } from '../../../src/core/results/Result';
import { Login } from "../../../src/core/types/Login";
import { SignUp } from "../../../src/core/types/SignUp";
import { Token } from "../../../src/core/types/Token";
import AuthService from "../../../src/services/auth.service";

describe('Auth controller', () => {

    describe('login', () => {
        const mTokenResult: SuccessDataResult<Token> = {
            status: true,
            data: {
                token: "mock_value"
            }
        };
        const mTokenErrorResult: ErrorDataResult<Token | null> = {
            status: false,
            data: null
        };

        const mLogin: Login = {
            username: "mock_value",
            password: "mock_value"
        };

        it('Should call auth login service and send success response correctly', async () => {
            jest.spyOn(AuthService, 'login').mockResolvedValueOnce(mTokenResult as SuccessDataResult<Token>);

            const mReq = getMockReq({ query: {}, body: mLogin });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await AuthController.login(mReq, mRes.res, mNext);

            expect(AuthService.login).toBeCalled();
            expect(AuthService.login).toBeCalledWith(mLogin);
            expect(mRes.res.status).toBeCalledWith(200);
            expect(mRes.res.json).toBeCalledWith(mTokenResult);
        });

        it('Should call auth login service and send error response correctly', async () => {
            jest.spyOn(AuthService, 'login').mockResolvedValueOnce(mTokenErrorResult as ErrorDataResult<Token | null>);

            const mReq = getMockReq({ query: {}, body: mLogin });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await AuthController.login(mReq, mRes.res, mNext);

            expect(AuthService.login).toBeCalled();
            expect(AuthService.login).toBeCalledWith(mLogin);
            expect(mRes.res.status).toBeCalledWith(400);
            expect(mRes.res.json).toBeCalledWith(mTokenErrorResult);
        });

        it('Should call auth login service and handle thrown exception from service', async () => {
            jest.spyOn(AuthService, 'login').mockImplementation(() => {
                throw new Error();
            });

            const mReq = getMockReq({ query: {}, body: mLogin });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await AuthController.login(mReq, mRes.res, mNext);

            expect(AuthService.login).toBeCalled();
            expect(AuthService.login).toBeCalledWith(mLogin);
            expect(mNext).toBeCalled();
            expect(mRes.res.locals.err).toBeDefined();
            expect(mRes.res.locals.err).toBeInstanceOf(Error);
        });

    });

    describe('signUp', () => {

        const mSuccessResult: SuccessResult = {
            status: true
        }

        const mErrorResult: ErrorResult = {
            status: false
        }

        const mSignup: SignUp = {
            email: "mock_value",
            username: "mock_value",
            password: "mock_value"
        };

        it('Should call auth signUp service and send success response correctly', async () => {
            jest.spyOn(AuthService, 'signUp').mockResolvedValueOnce(mSuccessResult as SuccessResult);

            const mReq = getMockReq({ query: {}, body: mSignup });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await AuthController.signUp(mReq, mRes.res, mNext);

            expect(AuthService.signUp).toBeCalled();
            expect(AuthService.signUp).toBeCalledWith(mSignup);
            expect(mRes.res.status).toBeCalledWith(200);
            expect(mRes.res.json).toBeCalledWith(mSuccessResult);
        });

        it('Should call auth signUp service and send error response correctly', async () => {
            jest.spyOn(AuthService, 'signUp').mockResolvedValueOnce(mErrorResult as ErrorResult);

            const mReq = getMockReq({ query: {}, body: mSignup });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await AuthController.signUp(mReq, mRes.res, mNext);

            expect(AuthService.signUp).toBeCalled();
            expect(AuthService.signUp).toBeCalledWith(mSignup);
            expect(mRes.res.status).toBeCalledWith(400);
            expect(mRes.res.json).toBeCalledWith(mErrorResult);
        });

        it('Should call auth signUp service and handle thrown exception from service', async () => {
            jest.spyOn(AuthService, 'signUp').mockImplementation(() => {
                throw new Error();
            });

            const mReq = getMockReq({ query: {}, body: mSignup });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await AuthController.signUp(mReq, mRes.res, mNext);

            expect(AuthService.signUp).toBeCalled();
            expect(AuthService.signUp).toBeCalledWith(mSignup);
            expect(mNext).toBeCalled();
            expect(mRes.res.locals.err).toBeDefined();
            expect(mRes.res.locals.err).toBeInstanceOf(Error);
        });

    });

    describe('sendVerification', () => {

        const mSuccessResult: SuccessResult = {
            status: true
        }

        const mErrorResult: ErrorResult = {
            status: false
        }

        const mEmail: string = "mock_value";

        it('Should call auth sendVerification service and send success response correctly', async () => {
            jest.spyOn(AuthService, 'sendVerification').mockResolvedValueOnce(mSuccessResult as SuccessResult);

            const mReq = getMockReq({ query: {}, params: { email: mEmail } });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await AuthController.sendVerification(mReq, mRes.res, mNext);

            expect(AuthService.sendVerification).toBeCalled();
            expect(AuthService.sendVerification).toBeCalledWith(mEmail);
            expect(mRes.res.status).toBeCalledWith(200);
            expect(mRes.res.json).toBeCalledWith(mSuccessResult);
        });

        it('Should call auth sendVerification service and send error response correctly', async () => {
            jest.spyOn(AuthService, 'sendVerification').mockResolvedValueOnce(mErrorResult as ErrorResult);

            const mReq = getMockReq({ query: {}, params: { email: mEmail } });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await AuthController.sendVerification(mReq, mRes.res, mNext);

            expect(AuthService.sendVerification).toBeCalled();
            expect(AuthService.sendVerification).toBeCalledWith(mEmail);
            expect(mRes.res.status).toBeCalledWith(400);
            expect(mRes.res.json).toBeCalledWith(mErrorResult);
        });

        it('Should call auth sendVerification service and handle thrown exception from service', async () => {
            jest.spyOn(AuthService, 'sendVerification').mockImplementation(() => {
                throw new Error();
            });

            const mReq = getMockReq({ query: {}, params: { email: mEmail } });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await AuthController.sendVerification(mReq, mRes.res, mNext);

            expect(AuthService.sendVerification).toBeCalled();
            expect(AuthService.sendVerification).toBeCalledWith(mEmail);
            expect(mNext).toBeCalled();
            expect(mRes.res.locals.err).toBeDefined();
            expect(mRes.res.locals.err).toBeInstanceOf(Error);
        });

    });

    describe('verify', () => {

        const mSuccessResult: SuccessResult = {
            status: true
        }

        const mErrorResult: ErrorResult = {
            status: false
        }

        const mToken: Token = {
            token: "mock_value"
        };

        it('Should call auth verify service and send success response correctly', async () => {
            jest.spyOn(AuthService, 'verify').mockResolvedValueOnce(mSuccessResult as SuccessResult);

            const mReq = getMockReq({ query: {}, body: mToken });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await AuthController.verify(mReq, mRes.res, mNext);

            expect(AuthService.verify).toBeCalled();
            expect(AuthService.verify).toBeCalledWith(mToken);
            expect(mRes.res.status).toBeCalledWith(200);
            expect(mRes.res.json).toBeCalledWith(mSuccessResult);
        });

        it('Should call auth verify service and send error response correctly', async () => {
            jest.spyOn(AuthService, 'verify').mockResolvedValueOnce(mErrorResult as ErrorResult);

            const mReq = getMockReq({ query: {}, body: mToken });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await AuthController.verify(mReq, mRes.res, mNext);

            expect(AuthService.verify).toBeCalled();
            expect(AuthService.verify).toBeCalledWith(mToken);
            expect(mRes.res.status).toBeCalledWith(400);
            expect(mRes.res.json).toBeCalledWith(mErrorResult);
        });

        it('Should call auth verify service and handle thrown exception from service', async () => {
            jest.spyOn(AuthService, 'verify').mockImplementation(() => {
                throw new Error();
            });

            const mReq = getMockReq({ query: {}, body: mToken });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await AuthController.verify(mReq, mRes.res, mNext);

            expect(AuthService.verify).toBeCalled();
            expect(AuthService.verify).toBeCalledWith(mToken);
            expect(mNext).toBeCalled();
            expect(mRes.res.locals.err).toBeDefined();
            expect(mRes.res.locals.err).toBeInstanceOf(Error);
        });

    });

});