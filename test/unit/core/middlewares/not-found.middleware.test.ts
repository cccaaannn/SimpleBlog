import { getMockReq, getMockRes } from '@jest-mock/express'

import { notFound } from '../../../../src/core/middlewares/not-found.middleware';


describe('not-found middleware', () => {

    describe('notFound', () => {

        test('Successfully catching non existing route', async () => {
            const mReq = getMockReq({});
            const mRes = getMockRes({ status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            notFound()(mReq, mRes.res, mNext);

            expect(mRes.res.status).toBeCalledWith(404);
            expect(mRes.res.json).toBeCalled();
        });

        test('Passing error to next middleware', async () => {
            const mReq = getMockReq({});
            const mRes = getMockRes({ locals: { err: { message: "err" } }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            notFound()(mReq, mRes.res, mNext);

            expect(mNext).toBeCalled();
        });

    });

});