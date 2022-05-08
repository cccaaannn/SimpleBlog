import { getMockReq, getMockRes } from '@jest-mock/express'

import JWTService from '../../../../src/core/services/jwt.service';
import Roles from '../../../../src/core/types/enums/Roles';

import { allowForRoles, extractTokenIfExists, decodeTokenIfExists, decodeAndVerifyToken } from "../../../../src/core/middlewares/secured-operation.middleware";
import { MockValues } from '../../../utils/mocks/const-mock-values';


describe('secured-operation middleware', () => {

    describe('extractTokenIfExists', () => {

        test('Empty Auth header', async () => {
            const mReq = getMockReq({ headers: {} });
            const mRes = getMockRes({ status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await extractTokenIfExists()(mReq, mRes.res, mNext);

            expect(mRes.res.locals.token).toEqual(null);
            expect(mNext).toBeCalled();
        });

        test('Full Auth header', async () => {
            const mReq = getMockReq({ headers: { authorization: "bearer " + MockValues.mToken1.token } });
            const mRes = getMockRes({ status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await extractTokenIfExists()(mReq, mRes.res, mNext);

            expect(mRes.res.locals.token).toEqual(MockValues.mToken1);
            expect(mNext).toBeCalled();
        });

    });

    describe('decodeTokenIfExists', () => {

        test('Non existing token', async () => {
            const mReq = getMockReq({});
            const mRes = getMockRes({ status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await decodeTokenIfExists()(mReq, mRes.res, mNext);

            expect(mRes.res.locals.tokenPayload).toBeUndefined();
            expect(mNext).toBeCalled();
        });

        test('Null token', async () => {
            const mReq = getMockReq({});
            const mRes = getMockRes({ locals: { token: null }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await decodeTokenIfExists()(mReq, mRes.res, mNext);

            expect(mRes.res.locals.tokenPayload).toBeUndefined();
            expect(mNext).toBeCalled();
        });

        test('Existing token', async () => {
            jest.spyOn(JWTService, 'verify').mockResolvedValueOnce(MockValues.mSuccessDataResultTokenPayloadUser1);

            const mReq = getMockReq({});
            const mRes = getMockRes({ locals: { token: MockValues.mToken1.token }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await decodeTokenIfExists()(mReq, mRes.res, mNext);

            expect(JWTService.verify).toBeCalled();
            expect(JWTService.verify).toBeCalledWith(MockValues.mToken1.token);
            expect(mRes.res.locals.tokenPayload).toEqual(MockValues.mSuccessDataResultTokenPayloadUser1.data);
            expect(mNext).toBeCalled();
        });

    });

    describe('decodeAndVerifyToken', () => {

        test('Non existing token', async () => {
            const mReq = getMockReq({});
            const mRes = getMockRes({ status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await decodeAndVerifyToken()(mReq, mRes.res, mNext);

            expect(mRes.res.status).toBeCalledWith(401);
            expect(mRes.res.json).toBeCalled();
        });

        test('Null token', async () => {
            const mReq = getMockReq({});
            const mRes = getMockRes({ locals: { token: null }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await decodeAndVerifyToken()(mReq, mRes.res, mNext);

            expect(mRes.res.status).toBeCalledWith(401);
            expect(mRes.res.json).toBeCalled();
        });

        test('Token verification fail', async () => {
            jest.spyOn(JWTService, 'verify').mockResolvedValueOnce(MockValues.mErrorDataResult);

            const mReq = getMockReq({});
            const mRes = getMockRes({ locals: { token: MockValues.mToken1.token }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await decodeAndVerifyToken()(mReq, mRes.res, mNext);

            expect(JWTService.verify).toBeCalled();
            expect(JWTService.verify).toBeCalledWith(MockValues.mToken1.token);
            expect(mRes.res.status).toBeCalledWith(403);
            expect(mRes.res.json).toBeCalled();
        });

        test('Wrong token type', async () => {
            jest.spyOn(JWTService, 'verify').mockResolvedValueOnce(MockValues.mSuccessDataResultTokenPayloadResetUser1);

            const mReq = getMockReq({});
            const mRes = getMockRes({ locals: { token: MockValues.mToken1.token }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await decodeAndVerifyToken()(mReq, mRes.res, mNext);

            expect(JWTService.verify).toBeCalled();
            expect(JWTService.verify).toBeCalledWith(MockValues.mToken1.token);
            expect(mRes.res.status).toBeCalledWith(403);
            expect(mRes.res.json).toBeCalled();
        });

        test('Successful token verification', async () => {
            jest.spyOn(JWTService, 'verify').mockResolvedValueOnce(MockValues.mSuccessDataResultTokenPayloadUser1);

            const mReq = getMockReq({});
            const mRes = getMockRes({ locals: { token: MockValues.mToken1.token }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await decodeAndVerifyToken()(mReq, mRes.res, mNext);

            expect(JWTService.verify).toBeCalled();
            expect(JWTService.verify).toBeCalledWith(MockValues.mToken1.token);
            expect(mRes.res.locals.token).toEqual(MockValues.mToken1.token);
            expect(mRes.res.locals.tokenPayload).toEqual(MockValues.mSuccessDataResultTokenPayloadUser1.data);

            expect(mNext).toBeCalled();
        });

    });


    describe('allowForRoles', () => {

        test('Unauthorized role', async () => {
            const mReq = getMockReq({ headers: {} });
            const mRes = getMockRes({ locals: { tokenPayload: MockValues.mTokenPayloadUser1 }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            // Admin only area
            const acceptedRoles: Roles[] = [Roles.ADMIN]

            await allowForRoles(acceptedRoles)(mReq, mRes.res, mNext);

            expect(mRes.res.status).toBeCalledWith(403);
            expect(mRes.res.json).toBeCalled();
        });

        test('Authorized role', async () => {
            const mReq = getMockReq({ headers: {} });
            const mRes = getMockRes({ locals: { tokenPayload: MockValues.mTokenPayloadUser1 }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            // Admin and user only area
            const acceptedRoles: Roles[] = [Roles.USER, Roles.ADMIN]

            await allowForRoles(acceptedRoles)(mReq, mRes.res, mNext);

            expect(mNext).toBeCalled();
        });

    });

});