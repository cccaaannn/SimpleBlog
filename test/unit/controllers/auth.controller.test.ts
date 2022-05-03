import { getMockReq, getMockRes } from '@jest-mock/express'

import AuthController from '../../../src/controllers/auth.controller';
import AuthService from "../../../src/services/auth.service";

import { MockValues } from '../../utils/mocks/const-mock-values';


describe('Auth controller', () => {

    describe('login', () => {

        test('Success', async () => {
            jest.spyOn(AuthService, 'login').mockResolvedValueOnce(MockValues.mSuccessDataResultToken1);

            const mReq = getMockReq({ query: {}, body: MockValues.mLoginUser1 });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await AuthController.login(mReq, mRes.res, mNext);

            expect(AuthService.login).toBeCalled();
            expect(AuthService.login).toBeCalledWith(MockValues.mLoginUser1);
            expect(mRes.res.status).toBeCalledWith(200);
            expect(mRes.res.json).toBeCalledWith(MockValues.mSuccessDataResultToken1);
        });

        test('Error', async () => {
            jest.spyOn(AuthService, 'login').mockResolvedValueOnce(MockValues.mErrorDataResult);

            const mReq = getMockReq({ query: {}, body: MockValues.mLoginUser1 });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await AuthController.login(mReq, mRes.res, mNext);

            expect(AuthService.login).toBeCalled();
            expect(AuthService.login).toBeCalledWith(MockValues.mLoginUser1);
            expect(mRes.res.status).toBeCalledWith(400);
            expect(mRes.res.json).toBeCalledWith(MockValues.mErrorDataResult);
        });

        test('Exception', async () => {
            jest.spyOn(AuthService, 'login').mockImplementation(() => {
                throw new Error();
            });

            const mReq = getMockReq({ query: {}, body: MockValues.mLoginUser1 });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await AuthController.login(mReq, mRes.res, mNext);

            expect(AuthService.login).toBeCalled();
            expect(AuthService.login).toBeCalledWith(MockValues.mLoginUser1);
            expect(mNext).toBeCalled();
            expect(mRes.res.locals.err).toBeDefined();
            expect(mRes.res.locals.err).toBeInstanceOf(Error);
        });

    });

    describe('signUp', () => {

        test('Success', async () => {
            jest.spyOn(AuthService, 'signUp').mockResolvedValueOnce(MockValues.mSuccessResult);

            const mReq = getMockReq({ query: {}, body: MockValues.mSignUp1 });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await AuthController.signUp(mReq, mRes.res, mNext);

            expect(AuthService.signUp).toBeCalled();
            expect(AuthService.signUp).toBeCalledWith(MockValues.mSignUp1);
            expect(mRes.res.status).toBeCalledWith(200);
            expect(mRes.res.json).toBeCalledWith(MockValues.mSuccessResult);
        });

        test('Error', async () => {
            jest.spyOn(AuthService, 'signUp').mockResolvedValueOnce(MockValues.mErrorResult);

            const mReq = getMockReq({ query: {}, body: MockValues.mSignUp1 });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await AuthController.signUp(mReq, mRes.res, mNext);

            expect(AuthService.signUp).toBeCalled();
            expect(AuthService.signUp).toBeCalledWith(MockValues.mSignUp1);
            expect(mRes.res.status).toBeCalledWith(400);
            expect(mRes.res.json).toBeCalledWith(MockValues.mErrorResult);
        });

        test('Exception', async () => {
            jest.spyOn(AuthService, 'signUp').mockImplementation(() => {
                throw new Error();
            });

            const mReq = getMockReq({ query: {}, body: MockValues.mSignUp1 });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await AuthController.signUp(mReq, mRes.res, mNext);

            expect(AuthService.signUp).toBeCalled();
            expect(AuthService.signUp).toBeCalledWith(MockValues.mSignUp1);
            expect(mNext).toBeCalled();
            expect(mRes.res.locals.err).toBeDefined();
            expect(mRes.res.locals.err).toBeInstanceOf(Error);
        });

    });

    describe('sendVerification', () => {

        test('Success', async () => {
            jest.spyOn(AuthService, 'sendVerification').mockResolvedValueOnce(MockValues.mSuccessResult);

            const mReq = getMockReq({ query: {}, params: { email: MockValues.mEmail1 } });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await AuthController.sendVerification(mReq, mRes.res, mNext);

            expect(AuthService.sendVerification).toBeCalled();
            expect(AuthService.sendVerification).toBeCalledWith(MockValues.mEmail1);
            expect(mRes.res.status).toBeCalledWith(200);
            expect(mRes.res.json).toBeCalledWith(MockValues.mSuccessResult);
        });

        test('Error', async () => {
            jest.spyOn(AuthService, 'sendVerification').mockResolvedValueOnce(MockValues.mErrorResult);

            const mReq = getMockReq({ query: {}, params: { email: MockValues.mEmail1 } });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await AuthController.sendVerification(mReq, mRes.res, mNext);

            expect(AuthService.sendVerification).toBeCalled();
            expect(AuthService.sendVerification).toBeCalledWith(MockValues.mEmail1);
            expect(mRes.res.status).toBeCalledWith(400);
            expect(mRes.res.json).toBeCalledWith(MockValues.mErrorResult);
        });

        test('Exception', async () => {
            jest.spyOn(AuthService, 'sendVerification').mockImplementation(() => {
                throw new Error();
            });

            const mReq = getMockReq({ query: {}, params: { email: MockValues.mEmail1 } });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await AuthController.sendVerification(mReq, mRes.res, mNext);

            expect(AuthService.sendVerification).toBeCalled();
            expect(AuthService.sendVerification).toBeCalledWith(MockValues.mEmail1);
            expect(mNext).toBeCalled();
            expect(mRes.res.locals.err).toBeDefined();
            expect(mRes.res.locals.err).toBeInstanceOf(Error);
        });

    });

    describe('verify', () => {

        test('Success', async () => {
            jest.spyOn(AuthService, 'verify').mockResolvedValueOnce(MockValues.mSuccessResult);

            const mReq = getMockReq({ query: {}, body: MockValues.mToken1 });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await AuthController.verify(mReq, mRes.res, mNext);

            expect(AuthService.verify).toBeCalled();
            expect(AuthService.verify).toBeCalledWith(MockValues.mToken1);
            expect(mRes.res.status).toBeCalledWith(200);
            expect(mRes.res.json).toBeCalledWith(MockValues.mSuccessResult);
        });

        test('Error', async () => {
            jest.spyOn(AuthService, 'verify').mockResolvedValueOnce(MockValues.mErrorResult);

            const mReq = getMockReq({ query: {}, body: MockValues.mToken1 });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await AuthController.verify(mReq, mRes.res, mNext);

            expect(AuthService.verify).toBeCalled();
            expect(AuthService.verify).toBeCalledWith(MockValues.mToken1);
            expect(mRes.res.status).toBeCalledWith(400);
            expect(mRes.res.json).toBeCalledWith(MockValues.mErrorResult);
        });

        test('Exception', async () => {
            jest.spyOn(AuthService, 'verify').mockImplementation(() => {
                throw new Error();
            });

            const mReq = getMockReq({ query: {}, body: MockValues.mToken1 });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await AuthController.verify(mReq, mRes.res, mNext);

            expect(AuthService.verify).toBeCalled();
            expect(AuthService.verify).toBeCalledWith(MockValues.mToken1);
            expect(mNext).toBeCalled();
            expect(mRes.res.locals.err).toBeDefined();
            expect(mRes.res.locals.err).toBeInstanceOf(Error);
        });

    });

});