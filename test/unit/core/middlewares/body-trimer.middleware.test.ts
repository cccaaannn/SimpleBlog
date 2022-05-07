import { getMockReq, getMockRes } from '@jest-mock/express'

import { bodyTrimer } from '../../../../src/core/middlewares/body-trimer.middleware';
import { MockValues } from '../../../utils/mocks/const-mock-values';


describe('body-trimer middleware', () => {

    describe('bodyTrimer', () => {

        test('Successfully trimming request body', async () => {
            const mReq = getMockReq({ body: MockValues.mUnstripedBody1 });
            const mRes = getMockRes({ status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            bodyTrimer()(mReq, mRes.res, mNext);

            expect(mReq.body.key1).toEqual(MockValues.mStripedBody1.key1);
            expect(mReq.body.key2).toEqual(MockValues.mStripedBody1.key2);
            expect(mNext).toBeCalled();
        });

    });

});