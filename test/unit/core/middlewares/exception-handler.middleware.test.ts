import { getMockReq, getMockRes } from '@jest-mock/express'

import { exceptionHandler } from '../../../../src/core/middlewares/exception-handler.middleware';


describe('exception-handler middleware', () => {

    describe('exceptionHandler', () => {

        test('Successfully catching random exception and returning error result.', async () => {
            const mReq = getMockReq({});
            const mRes = getMockRes({ locals: { err: { message: "" } }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            exceptionHandler()(mReq, mRes.res, mNext);

            expect(mRes.res.status).toBeCalledWith(500);
            expect(mRes.res.json).toBeCalled();
        });

        test('Exception occurring in exception handler', async () => {
            const mReq = getMockReq({});
            const mRes = getMockRes({ locals: { err: { message: "" } }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            const err = new Error();
            jest.spyOn(mRes.res, 'json').mockImplementation(() => {
                throw err;
            });

            exceptionHandler()(mReq, mRes.res, mNext);

            expect(mNext).toBeCalled();
            expect(mNext).toBeCalledWith(err);
        });

    });

});