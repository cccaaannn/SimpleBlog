import { getMockReq, getMockRes } from '@jest-mock/express'

import PostController from '../../../src/controllers/post.controller';
import PostService from '../../../src/services/post.service';
import Visibility from '../../../src/types/enums/Visibility';

import { ErrorResult, SuccessResult } from '../../../src/core/results/Result';
import { MockValues } from '../../utils/mocks/const-mock-values';
import Category from '../../../src/types/enums/Category';


describe('Post controller', () => {

    describe('getAll', () => {

        test('Success without any parameters', async () => {
            jest.spyOn(PostService, 'getAll').mockResolvedValueOnce(MockValues.mSuccessDataResultPostsFull);

            const mReq = getMockReq({ query: {} });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.getAll(mReq, mRes.res, mNext);

            expect(PostService.getAll).toBeCalled();
            expect(PostService.getAll).toBeCalledWith(null, null, null);
            expect(mRes.res.status).toBeCalledWith(200);
            expect(mRes.res.json).toBeCalledWith(MockValues.mSuccessDataResultPostsFull);
        });

        test('Success with all parameters', async () => {
            jest.spyOn(PostService, 'getAll').mockResolvedValueOnce(MockValues.mSuccessDataResultPostsFull);

            const mReq = getMockReq({ query: { field: "visibility", asc: 1, category: Category.GENERAL } });
            const mRes = getMockRes({ locals: { tokenPayload: MockValues.mTokenPayloadUser1 }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.getAll(mReq, mRes.res, mNext);

            expect(PostService.getAll).toBeCalled();
            expect(PostService.getAll).toBeCalledWith(MockValues.mTokenPayloadUser1, Category.GENERAL, MockValues.mPostSort)
            expect(mRes.res.status).toBeCalledWith(200);
            expect(mRes.res.json).toBeCalledWith(MockValues.mSuccessDataResultPostsFull);
        });

        test('Error', async () => {
            jest.spyOn(PostService, 'getAll').mockResolvedValueOnce(MockValues.mErrorResult as any);

            const mReq = getMockReq({ query: {} });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.getAll(mReq, mRes.res, mNext);

            expect(PostService.getAll).toBeCalled();
            expect(mRes.res.status).toBeCalledWith(400);
            expect(mRes.res.json).toBeCalledWith(MockValues.mErrorResult);
        });

        test('Exception', async () => {
            jest.spyOn(PostService, 'getAll').mockImplementation(() => {
                throw new Error();
            });

            const mReq = getMockReq({ query: {} });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.getAll(mReq, mRes.res, mNext);

            expect(PostService.getAll).toBeCalled();
            expect(mNext).toBeCalled();
            expect(mRes.res.locals.err).toBeDefined();
            expect(mRes.res.locals.err).toBeInstanceOf(Error);
        });

    });

    describe('getByUserId', () => {

        test('Success without any parameters', async () => {
            jest.spyOn(PostService, 'getByUserId').mockResolvedValueOnce(MockValues.mSuccessDataResultPostsFull);

            const mReq = getMockReq({ query: {}, params: { userId: MockValues.mUserId1 } });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.getByUserId(mReq, mRes.res, mNext);

            expect(PostService.getByUserId).toBeCalled();
            expect(PostService.getByUserId).toBeCalledWith(MockValues.mUserId1, null, null, null);
            expect(mRes.res.status).toBeCalledWith(200);
            expect(mRes.res.json).toBeCalledWith(MockValues.mSuccessDataResultPostsFull);
        });

        test('Success with all parameters', async () => {
            jest.spyOn(PostService, 'getByUserId').mockResolvedValueOnce(MockValues.mSuccessDataResultPostsFull);

            const mReq = getMockReq({ query: { field: "visibility", asc: 1, category: Category.GENERAL }, params: { userId: MockValues.mUserId1 } });
            const mRes = getMockRes({ locals: { tokenPayload: MockValues.mTokenPayloadUser1 }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.getByUserId(mReq, mRes.res, mNext);

            expect(PostService.getByUserId).toBeCalled();
            expect(PostService.getByUserId).toBeCalledWith(MockValues.mUserId1, MockValues.mTokenPayloadUser1, Category.GENERAL, MockValues.mPostSort)
            expect(mRes.res.status).toBeCalledWith(200);
            expect(mRes.res.json).toBeCalledWith(MockValues.mSuccessDataResultPostsFull);
        });

        test('Error', async () => {
            jest.spyOn(PostService, 'getByUserId').mockResolvedValueOnce(MockValues.mErrorResult as any);

            const mReq = getMockReq({ query: {}, params: { userId: MockValues.mUserId1 } });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.getByUserId(mReq, mRes.res, mNext);

            expect(PostService.getByUserId).toBeCalled();
            expect(PostService.getByUserId).toBeCalledWith(MockValues.mUserId1, null, null, null);
            expect(mRes.res.status).toBeCalledWith(400);
            expect(mRes.res.json).toBeCalledWith(MockValues.mErrorResult);
        });

        test('Exception', async () => {
            jest.spyOn(PostService, 'getByUserId').mockImplementation(() => {
                throw new Error();
            });

            const mReq = getMockReq({ query: {}, params: { userId: MockValues.mUserId1 } });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.getByUserId(mReq, mRes.res, mNext);

            expect(PostService.getByUserId).toBeCalled();
            expect(PostService.getByUserId).toBeCalledWith(MockValues.mUserId1, null, null, null);
            expect(mNext).toBeCalled();
            expect(mRes.res.locals.err).toBeDefined();
            expect(mRes.res.locals.err).toBeInstanceOf(Error);
        });

    });

    describe('getById', () => {

        test('Success without any parameters', async () => {
            jest.spyOn(PostService, 'getById').mockResolvedValueOnce(MockValues.mSuccessDataResultPost1);

            const mReq = getMockReq({ query: { }, params: { id: MockValues.mPostId1 } });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.getById(mReq, mRes.res, mNext);

            expect(PostService.getById).toBeCalled();
            expect(PostService.getById).toBeCalledWith(MockValues.mPostId1, undefined);
            expect(mRes.res.status).toBeCalledWith(200);
            expect(mRes.res.json).toBeCalledWith(MockValues.mSuccessDataResultPost1);
        });

        test('Success with all parameters', async () => {
            jest.spyOn(PostService, 'getById').mockResolvedValueOnce(MockValues.mSuccessDataResultPost1);

            const mReq = getMockReq({ query: { }, params: { id: MockValues.mPostId1 } });
            const mRes = getMockRes({ locals: { tokenPayload: MockValues.mTokenPayloadUser1 }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.getById(mReq, mRes.res, mNext);

            expect(PostService.getById).toBeCalled();
            expect(PostService.getById).toBeCalledWith(MockValues.mPostId1, MockValues.mTokenPayloadUser1)
            expect(mRes.res.status).toBeCalledWith(200);
            expect(mRes.res.json).toBeCalledWith(MockValues.mSuccessDataResultPost1);
        });

        test('Error', async () => {
            jest.spyOn(PostService, 'getById').mockResolvedValueOnce(MockValues.mErrorResult as any);

            const mReq = getMockReq({ query: {}, params: { id: MockValues.mPostId1 } });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.getById(mReq, mRes.res, mNext);

            expect(PostService.getById).toBeCalled();
            expect(PostService.getById).toBeCalledWith(MockValues.mPostId1, undefined);
            expect(mRes.res.status).toBeCalledWith(400);
            expect(mRes.res.json).toBeCalledWith(MockValues.mErrorResult);
        });

        test('Exception', async () => {
            jest.spyOn(PostService, 'getById').mockImplementation(() => {
                throw new Error();
            });

            const mReq = getMockReq({ query: {}, params: { id: MockValues.mPostId1 } });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.getById(mReq, mRes.res, mNext);

            expect(PostService.getById).toBeCalled();
            expect(PostService.getById).toBeCalledWith(MockValues.mPostId1, undefined);
            expect(mNext).toBeCalled();
            expect(mRes.res.locals.err).toBeDefined();
            expect(mRes.res.locals.err).toBeInstanceOf(Error);
        });

    });

    describe('add', () => {

        test('Success', async () => {
            const result = new SuccessResult()
            jest.spyOn(PostService, 'add').mockResolvedValueOnce(result);

            const mReq = getMockReq({ query: {}, body: MockValues.mPostToAdd });
            const mRes = getMockRes({ locals: { tokenPayload: MockValues.mTokenPayloadUser1 }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.add(mReq, mRes.res, mNext);

            expect(PostService.add).toBeCalled();
            expect(PostService.add).toBeCalledWith(MockValues.mPostToAdd, MockValues.mTokenPayloadUser1)
            expect(mRes.res.status).toBeCalledWith(200);
            expect(mRes.res.json).toBeCalledWith(result);
        });

        test('Error', async () => {
            const result = new ErrorResult()
            jest.spyOn(PostService, 'add').mockResolvedValueOnce(result);

            const mReq = getMockReq({ query: {}, body: MockValues.mPostToAdd });
            const mRes = getMockRes({ locals: { tokenPayload: MockValues.mTokenPayloadUser1 }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.add(mReq, mRes.res, mNext);

            expect(PostService.add).toBeCalled();
            expect(PostService.add).toBeCalledWith(MockValues.mPostToAdd, MockValues.mTokenPayloadUser1)
            expect(mRes.res.status).toBeCalledWith(400);
            expect(mRes.res.json).toBeCalledWith(result);
        });

        test('Exception', async () => {
            jest.spyOn(PostService, 'add').mockImplementation(() => {
                throw new Error();
            });

            const mReq = getMockReq({ query: {}, body: MockValues.mPostToAdd });
            const mRes = getMockRes({ locals: { tokenPayload: MockValues.mTokenPayloadUser1 }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.add(mReq, mRes.res, mNext);

            expect(PostService.add).toBeCalled();
            expect(PostService.add).toBeCalledWith(MockValues.mPostToAdd, MockValues.mTokenPayloadUser1)
            expect(mNext).toBeCalled();
            expect(mRes.res.locals.err).toBeDefined();
            expect(mRes.res.locals.err).toBeInstanceOf(Error);
        });

    });

    describe('update', () => {

        test('Success', async () => {
            const result = new SuccessResult()
            jest.spyOn(PostService, 'update').mockResolvedValueOnce(result);

            const mReq = getMockReq({ query: {}, params: { postId: MockValues.mPostId1 }, body: MockValues.mPostToUpdate });
            const mRes = getMockRes({ locals: { tokenPayload: MockValues.mTokenPayloadUser1 }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.update(mReq, mRes.res, mNext);

            expect(PostService.update).toBeCalled();
            expect(PostService.update).toBeCalledWith(MockValues.mPostId1, MockValues.mPostToUpdate, MockValues.mTokenPayloadUser1)
            expect(mRes.res.status).toBeCalledWith(200);
            expect(mRes.res.json).toBeCalledWith(result);
        });

        test('Error', async () => {
            const result = new ErrorResult()
            jest.spyOn(PostService, 'update').mockResolvedValueOnce(result);

            const mReq = getMockReq({ query: {}, params: { postId: MockValues.mPostId1 }, body: MockValues.mPostToUpdate });
            const mRes = getMockRes({ locals: { tokenPayload: MockValues.mTokenPayloadUser1 }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.update(mReq, mRes.res, mNext);

            expect(PostService.update).toBeCalled();
            expect(PostService.update).toBeCalledWith(MockValues.mPostId1, MockValues.mPostToUpdate, MockValues.mTokenPayloadUser1)
            expect(mRes.res.status).toBeCalledWith(400);
            expect(mRes.res.json).toBeCalledWith(result);
        });

        test('Exception', async () => {
            jest.spyOn(PostService, 'update').mockImplementation(() => {
                throw new Error();
            });

            const mReq = getMockReq({ query: {}, params: { postId: MockValues.mPostId1 }, body: MockValues.mPostToUpdate });
            const mRes = getMockRes({ locals: { tokenPayload: MockValues.mTokenPayloadUser1 }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.update(mReq, mRes.res, mNext);

            expect(PostService.update).toBeCalled();
            expect(PostService.update).toBeCalledWith(MockValues.mPostId1, MockValues.mPostToUpdate, MockValues.mTokenPayloadUser1)
            expect(mNext).toBeCalled();
            expect(mRes.res.locals.err).toBeDefined();
            expect(mRes.res.locals.err).toBeInstanceOf(Error);
        });

    });

    describe('addComment', () => {

        test('Success', async () => {
            const result = new SuccessResult()
            jest.spyOn(PostService, 'addComment').mockResolvedValueOnce(result);

            const mReq = getMockReq({ query: {}, params: { postId: MockValues.mPostId1 }, body: MockValues.mCommentAdd });
            const mRes = getMockRes({ locals: { tokenPayload: MockValues.mTokenPayloadUser1 }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.addComment(mReq, mRes.res, mNext);

            expect(PostService.addComment).toBeCalled();
            expect(PostService.addComment).toBeCalledWith(MockValues.mPostId1, MockValues.mCommentAdd, MockValues.mTokenPayloadUser1)
            expect(mRes.res.status).toBeCalledWith(200);
            expect(mRes.res.json).toBeCalledWith(result);
        });

        test('Error', async () => {
            const result = new ErrorResult()
            jest.spyOn(PostService, 'addComment').mockResolvedValueOnce(result);

            const mReq = getMockReq({ query: {}, params: { postId: MockValues.mPostId1 }, body: MockValues.mCommentAdd });
            const mRes = getMockRes({ locals: { tokenPayload: MockValues.mTokenPayloadUser1 }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.addComment(mReq, mRes.res, mNext);

            expect(PostService.addComment).toBeCalled();
            expect(PostService.addComment).toBeCalledWith(MockValues.mPostId1, MockValues.mCommentAdd, MockValues.mTokenPayloadUser1)
            expect(mRes.res.status).toBeCalledWith(400);
            expect(mRes.res.json).toBeCalledWith(result);
        });

        test('Exception', async () => {
            jest.spyOn(PostService, 'addComment').mockImplementation(() => {
                throw new Error();
            });

            const mReq = getMockReq({ query: {}, params: { postId: MockValues.mPostId1 }, body: MockValues.mCommentAdd });
            const mRes = getMockRes({ locals: { tokenPayload: MockValues.mTokenPayloadUser1 }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.addComment(mReq, mRes.res, mNext);

            expect(PostService.addComment).toBeCalled();
            expect(PostService.addComment).toBeCalledWith(MockValues.mPostId1, MockValues.mCommentAdd, MockValues.mTokenPayloadUser1)
            expect(mNext).toBeCalled();
            expect(mRes.res.locals.err).toBeDefined();
            expect(mRes.res.locals.err).toBeInstanceOf(Error);
        });

    });

    describe('removeComment', () => {

        test('Success', async () => {
            const result = new SuccessResult()
            jest.spyOn(PostService, 'removeComment').mockResolvedValueOnce(result);

            const mReq = getMockReq({ query: {}, params: { postId: MockValues.mPostId1, commentId: MockValues.mCommentId1 } });
            const mRes = getMockRes({ locals: { tokenPayload: MockValues.mTokenPayloadUser1 }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.removeComment(mReq, mRes.res, mNext);

            expect(PostService.removeComment).toBeCalled();
            expect(PostService.removeComment).toBeCalledWith(MockValues.mPostId1, MockValues.mCommentId1, MockValues.mTokenPayloadUser1)
            expect(mRes.res.status).toBeCalledWith(200);
            expect(mRes.res.json).toBeCalledWith(result);
        });

        test('Error', async () => {
            const result = new ErrorResult()
            jest.spyOn(PostService, 'removeComment').mockResolvedValueOnce(result);

            const mReq = getMockReq({ query: {}, params: { postId: MockValues.mPostId1, commentId: MockValues.mCommentId1 } });
            const mRes = getMockRes({ locals: { tokenPayload: MockValues.mTokenPayloadUser1 }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.removeComment(mReq, mRes.res, mNext);

            expect(PostService.removeComment).toBeCalled();
            expect(PostService.removeComment).toBeCalledWith(MockValues.mPostId1, MockValues.mCommentId1, MockValues.mTokenPayloadUser1)
            expect(mRes.res.status).toBeCalledWith(400);
            expect(mRes.res.json).toBeCalledWith(result);
        });

        test('Exception', async () => {
            jest.spyOn(PostService, 'removeComment').mockImplementation(() => {
                throw new Error();
            });

            const mReq = getMockReq({ query: {}, params: { postId: MockValues.mPostId1, commentId: MockValues.mCommentId1 } });
            const mRes = getMockRes({ locals: { tokenPayload: MockValues.mTokenPayloadUser1 }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.removeComment(mReq, mRes.res, mNext);

            expect(PostService.removeComment).toBeCalled();
            expect(PostService.removeComment).toBeCalledWith(MockValues.mPostId1, MockValues.mCommentId1, MockValues.mTokenPayloadUser1)
            expect(mNext).toBeCalled();
            expect(mRes.res.locals.err).toBeDefined();
            expect(mRes.res.locals.err).toBeInstanceOf(Error);
        });

    });

    describe('remove', () => {

        test('Success', async () => {
            const result = new SuccessResult()
            jest.spyOn(PostService, 'remove').mockResolvedValueOnce(result);

            const mReq = getMockReq({ query: {}, params: { id: MockValues.mPostId1 } });
            const mRes = getMockRes({ locals: { tokenPayload: MockValues.mTokenPayloadUser1 }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.remove(mReq, mRes.res, mNext);

            expect(PostService.remove).toBeCalled();
            expect(PostService.remove).toBeCalledWith(MockValues.mPostId1, MockValues.mTokenPayloadUser1)
            expect(mRes.res.status).toBeCalledWith(200);
            expect(mRes.res.json).toBeCalledWith(result);
        });

        test('Error', async () => {
            const result = new ErrorResult()
            jest.spyOn(PostService, 'remove').mockResolvedValueOnce(result);

            const mReq = getMockReq({ query: {}, params: { id: MockValues.mPostId1 } });
            const mRes = getMockRes({ locals: { tokenPayload: MockValues.mTokenPayloadUser1 }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.remove(mReq, mRes.res, mNext);

            expect(PostService.remove).toBeCalled();
            expect(PostService.remove).toBeCalledWith(MockValues.mPostId1, MockValues.mTokenPayloadUser1)
            expect(mRes.res.status).toBeCalledWith(400);
            expect(mRes.res.json).toBeCalledWith(result);
        });

        test('Exception', async () => {
            jest.spyOn(PostService, 'remove').mockImplementation(() => {
                throw new Error();
            });

            const mReq = getMockReq({ query: {}, params: { id: MockValues.mPostId1 } });
            const mRes = getMockRes({ locals: { tokenPayload: MockValues.mTokenPayloadUser1 }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.remove(mReq, mRes.res, mNext);

            expect(PostService.remove).toBeCalled();
            expect(PostService.remove).toBeCalledWith(MockValues.mPostId1, MockValues.mTokenPayloadUser1)
            expect(mNext).toBeCalled();
            expect(mRes.res.locals.err).toBeDefined();
            expect(mRes.res.locals.err).toBeInstanceOf(Error);
        });

    });

});