import { getMockReq, getMockRes } from '@jest-mock/express'

import JWTService from '../../../../src/core/services/jwt.service';
import Roles from '../../../../src/core/types/enums/Roles';

import { allowForRoles, extractAndValidateToken } from "../../../../src/core/middlewares/secured-operation.middleware";
import { MockValues } from '../../../utils/mocks/const-mock-values';


describe('secured-operation middleware', () => {

    describe('extractAndValidateToken', () => {

        test('Wrong token header', async () => {
            const mReq = getMockReq({ headers: {} });
            const mRes = getMockRes({ status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await extractAndValidateToken()(mReq, mRes.res, mNext);

            expect(mRes.res.status).toBeCalledWith(401);
            expect(mRes.res.json).toBeCalled();
        });

        test('Token verification fail', async () => {
            jest.spyOn(JWTService, 'verify').mockResolvedValueOnce(MockValues.mErrorDataResult);

            const mReq = getMockReq({ headers: { authorization: "bearer " + MockValues.mToken1.token } });
            const mRes = getMockRes({ status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await extractAndValidateToken()(mReq, mRes.res, mNext);

            expect(mRes.res.status).toBeCalledWith(403);
            expect(mRes.res.json).toBeCalled();
        });

        test('Successful token extraction and verification', async () => {
            jest.spyOn(JWTService, 'verify').mockResolvedValueOnce(MockValues.mSuccessDataResultTokenPayloadUser1);

            const mReq = getMockReq({ headers: { authorization: "bearer " + MockValues.mToken1.token } });
            const mRes = getMockRes({ status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await extractAndValidateToken()(mReq, mRes.res, mNext);

            expect(mRes.res.locals.token).toEqual(MockValues.mToken1);
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