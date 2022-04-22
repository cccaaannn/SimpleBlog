import { getMockReq, getMockRes } from '@jest-mock/express'

import Status from "../../../src/types/enums/Status";
import { ErrorDataResult, SuccessDataResult } from "../../../src/core/results/DataResult";
import { Post, PostAdd, PostSort, PostUpdate } from "../../../src/types/Post";
import { ErrorResult, SuccessResult } from '../../../src/core/results/Result';
import { TokenPayload } from '../../../src/core/types/TokenPayload';
import PostService from '../../../src/services/post.service';
import Visibility from '../../../src/types/enums/Visibility';
import PostController from '../../../src/controllers/post.controller';
import { CommentAdd } from '../../../src/types/Comment';


describe('Post controller', () => {

    describe('getAll', () => {
        const mPosts: SuccessDataResult<Post[]> = {
            status: true,
            data: [
                {
                    _id: "test_id_hash1",
                    owner: "test_id_hash1",
                    header: "test1",
                    body: "test1",
                    visibility: Visibility.PUBLIC,
                    comments: [
                        {
                            _id: "test_id_hash1",
                            owner: "test_id_hash1",
                            comment: "test1",
                            dateCreated: new Date()
                        }
                    ],
                    dateCreated: new Date()
                }
            ]
        }

        const mErrorResult: ErrorDataResult<Post[]> = {
            status: false,
            data: []
        }

        it('Should call post getAll service and send success response correctly', async () => {
            jest.spyOn(PostService, 'getAll').mockResolvedValueOnce(mPosts as SuccessDataResult<Post[]>);

            const mReq = getMockReq({ query: {} });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.getAll(mReq, mRes.res, mNext);

            expect(PostService.getAll).toBeCalled();
            expect(mRes.res.status).toBeCalledWith(200);
            expect(mRes.res.json).toBeCalledWith(mPosts);
        });

        it('Should call post getAll service with query parameters and send success response correctly', async () => {
            const mPostSort: PostSort = {
                visibility: 1
            }

            jest.spyOn(PostService, 'getAll').mockResolvedValueOnce(mPosts as SuccessDataResult<Post[]>);

            const mReq = getMockReq({ query: { field: "visibility", asc: 1 } });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.getAll(mReq, mRes.res, mNext);

            expect(PostService.getAll).toBeCalled();
            expect(PostService.getAll).toBeCalledWith(mPostSort)
            expect(mRes.res.status).toBeCalledWith(200);
            expect(mRes.res.json).toBeCalledWith(mPosts);
        });

        it('Should call post getAll service and send error response correctly', async () => {
            jest.spyOn(PostService, 'getAll').mockResolvedValueOnce(mErrorResult as ErrorDataResult<Post[]>);

            const mReq = getMockReq({ query: {} });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.getAll(mReq, mRes.res, mNext);

            expect(PostService.getAll).toBeCalled();
            expect(mRes.res.status).toBeCalledWith(400);
            expect(mRes.res.json).toBeCalledWith(mErrorResult);
        });

        it('Should call post getAll service and handle thrown exception from service', async () => {
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

    describe('getByVisibility', () => {

        const mVisibility = Visibility.PUBLIC

        const mPosts: SuccessDataResult<Post[]> = {
            status: true,
            data: [
                {
                    _id: "test_id_hash1",
                    owner: "test_id_hash1",
                    header: "test1",
                    body: "test1",
                    visibility: Visibility.PUBLIC,
                    comments: [
                        {
                            _id: "test_id_hash1",
                            owner: "test_id_hash1",
                            comment: "test1",
                            dateCreated: new Date()
                        }
                    ],
                    dateCreated: new Date()
                }
            ]
        }

        const mErrorResult: ErrorDataResult<Post[] | null> = {
            status: false,
            data: null
        }

        it('Should call post getByVisibility service and send success response correctly', async () => {
            jest.spyOn(PostService, 'getByVisibility').mockResolvedValueOnce(mPosts as SuccessDataResult<Post[]>);

            const mReq = getMockReq({ query: {}, params: { visibility: mVisibility } });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.getByVisibility(mReq, mRes.res, mNext);

            expect(PostService.getByVisibility).toBeCalled();
            expect(PostService.getByVisibility).toBeCalledWith(mVisibility, undefined)
            expect(mRes.res.status).toBeCalledWith(200);
            expect(mRes.res.json).toBeCalledWith(mPosts);
        });

        it('Should call post getByVisibility service with query parameters and send success response correctly', async () => {
            const mPostSort: PostSort = {
                visibility: 1
            }

            jest.spyOn(PostService, 'getByVisibility').mockResolvedValueOnce(mPosts as SuccessDataResult<Post[]>);

            const mReq = getMockReq({ query: { field: "visibility", asc: 1 }, params: { visibility: mVisibility } });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.getByVisibility(mReq, mRes.res, mNext);

            expect(PostService.getByVisibility).toBeCalled();
            expect(PostService.getByVisibility).toBeCalledWith(mVisibility, mPostSort)
            expect(mRes.res.status).toBeCalledWith(200);
            expect(mRes.res.json).toBeCalledWith(mPosts);
        });

        it('Should call post getByVisibility service and send error response correctly', async () => {
            jest.spyOn(PostService, 'getByVisibility').mockResolvedValueOnce(mErrorResult as ErrorDataResult<Post[]>);

            const mReq = getMockReq({ query: {}, params: { visibility: mVisibility } });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.getByVisibility(mReq, mRes.res, mNext);

            expect(PostService.getByVisibility).toBeCalled();
            expect(PostService.getByVisibility).toBeCalledWith(mVisibility, undefined)
            expect(mRes.res.status).toBeCalledWith(400);
            expect(mRes.res.json).toBeCalledWith(mErrorResult);
        });

        it('Should call post getByVisibility service and handle thrown exception from service', async () => {
            jest.spyOn(PostService, 'getByVisibility').mockImplementation(() => {
                throw new Error();
            });

            const mReq = getMockReq({ query: {}, params: { visibility: mVisibility } });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.getByVisibility(mReq, mRes.res, mNext);

            expect(PostService.getByVisibility).toBeCalled();
            expect(PostService.getByVisibility).toBeCalledWith(mVisibility, undefined)
            expect(mNext).toBeCalled();
            expect(mRes.res.locals.err).toBeDefined();
            expect(mRes.res.locals.err).toBeInstanceOf(Error);
        });
    });

    describe('getByUserId', () => {

        const mUserId = "mock_user_id"

        const mPosts: SuccessDataResult<Post[]> = {
            status: true,
            data: [
                {
                    _id: "test_id_hash1",
                    owner: "test_id_hash1",
                    header: "test1",
                    body: "test1",
                    visibility: Visibility.PUBLIC,
                    comments: [
                        {
                            _id: "test_id_hash1",
                            owner: "test_id_hash1",
                            comment: "test1",
                            dateCreated: new Date()
                        }
                    ],
                    dateCreated: new Date()
                }
            ]
        }

        const mErrorResult: ErrorDataResult<Post[] | null> = {
            status: false,
            data: null
        }

        it('Should call post getByUserId service and send success response correctly', async () => {
            jest.spyOn(PostService, 'getByUserId').mockResolvedValueOnce(mPosts as SuccessDataResult<Post[]>);

            const mReq = getMockReq({ query: {}, params: { userId: mUserId } });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.getByUserId(mReq, mRes.res, mNext);

            expect(PostService.getByUserId).toBeCalled();
            expect(PostService.getByUserId).toBeCalledWith(mUserId, undefined)
            expect(mRes.res.status).toBeCalledWith(200);
            expect(mRes.res.json).toBeCalledWith(mPosts);
        });

        it('Should call post getByUserId service with query parameters and send success response correctly', async () => {
            const mPostSort: PostSort = {
                visibility: 1
            }

            jest.spyOn(PostService, 'getByUserId').mockResolvedValueOnce(mPosts as SuccessDataResult<Post[]>);

            const mReq = getMockReq({ query: { field: "visibility", asc: 1 }, params: { userId: mUserId } });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.getByUserId(mReq, mRes.res, mNext);

            expect(PostService.getByUserId).toBeCalled();
            expect(PostService.getByUserId).toBeCalledWith(mUserId, mPostSort)
            expect(mRes.res.status).toBeCalledWith(200);
            expect(mRes.res.json).toBeCalledWith(mPosts);
        });

        it('Should call post getByUserId service and send error response correctly', async () => {
            jest.spyOn(PostService, 'getByUserId').mockResolvedValueOnce(mErrorResult as ErrorDataResult<Post[]>);

            const mReq = getMockReq({ query: {}, params: { userId: mUserId } });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.getByUserId(mReq, mRes.res, mNext);

            expect(PostService.getByUserId).toBeCalled();
            expect(PostService.getByUserId).toBeCalledWith(mUserId, undefined)
            expect(mRes.res.status).toBeCalledWith(400);
            expect(mRes.res.json).toBeCalledWith(mErrorResult);
        });

        it('Should call post getByUserId service and handle thrown exception from service', async () => {
            jest.spyOn(PostService, 'getByUserId').mockImplementation(() => {
                throw new Error();
            });

            const mReq = getMockReq({ query: {}, params: { userId: mUserId } });
            const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.getByUserId(mReq, mRes.res, mNext);

            expect(PostService.getByUserId).toBeCalled();
            expect(PostService.getByUserId).toBeCalledWith(mUserId, undefined)
            expect(mNext).toBeCalled();
            expect(mRes.res.locals.err).toBeDefined();
            expect(mRes.res.locals.err).toBeInstanceOf(Error);
        });
    });

    describe('add', () => {
        const postAdd: PostAdd = {
            owner: "mock_value",
            header: "mock_value",
            body: "mock_value",
            visibility: Visibility.PUBLIC
        };

        const tokenPayload: TokenPayload = {
            id: "mock_data",
            status: Status.ACTIVE,
            username: "mock_data",
            email: "mock_data",
            role: "mock_data",
        }

        it('Should call post add service and send success response correctly', async () => {
            const result = new SuccessResult()
            jest.spyOn(PostService, 'add').mockResolvedValueOnce(result);

            const mReq = getMockReq({ query: {}, body: postAdd });
            const mRes = getMockRes({ locals: { tokenPayload: tokenPayload }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.add(mReq, mRes.res, mNext);

            expect(PostService.add).toBeCalled();
            expect(PostService.add).toBeCalledWith(postAdd, tokenPayload)
            expect(mRes.res.status).toBeCalledWith(200);
            expect(mRes.res.json).toBeCalledWith(result);
        });

        it('Should call post add service and send error response correctly', async () => {
            const result = new ErrorResult()
            jest.spyOn(PostService, 'add').mockResolvedValueOnce(result);

            const mReq = getMockReq({ query: {}, body: postAdd });
            const mRes = getMockRes({ locals: { tokenPayload: tokenPayload }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.add(mReq, mRes.res, mNext);

            expect(PostService.add).toBeCalled();
            expect(PostService.add).toBeCalledWith(postAdd, tokenPayload)
            expect(mRes.res.status).toBeCalledWith(400);
            expect(mRes.res.json).toBeCalledWith(result);
        });

        it('Should call post add service and handle thrown exception from service', async () => {
            jest.spyOn(PostService, 'add').mockImplementation(() => {
                throw new Error();
            });

            const mReq = getMockReq({ query: {}, body: postAdd });
            const mRes = getMockRes({ locals: { tokenPayload: tokenPayload }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.add(mReq, mRes.res, mNext);

            expect(PostService.add).toBeCalled();
            expect(PostService.add).toBeCalledWith(postAdd, tokenPayload)
            expect(mNext).toBeCalled();
            expect(mRes.res.locals.err).toBeDefined();
            expect(mRes.res.locals.err).toBeInstanceOf(Error);
        });
    });

    describe('update', () => {
        const mPostId = "mock_user_id"

        const postUpdate: PostUpdate = {
            header: "mock_value",
            body: "mock_value",
            visibility: Visibility.PUBLIC
        };

        const tokenPayload: TokenPayload = {
            id: "mock_data",
            status: Status.ACTIVE,
            username: "mock_data",
            email: "mock_data",
            role: "mock_data",
        }

        it('Should call post update service and send success response correctly', async () => {
            const result = new SuccessResult()
            jest.spyOn(PostService, 'update').mockResolvedValueOnce(result);

            const mReq = getMockReq({ query: {}, params: { postId: mPostId }, body: postUpdate });
            const mRes = getMockRes({ locals: { tokenPayload: tokenPayload }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.update(mReq, mRes.res, mNext);

            expect(PostService.update).toBeCalled();
            expect(PostService.update).toBeCalledWith(mPostId, postUpdate, tokenPayload)
            expect(mRes.res.status).toBeCalledWith(200);
            expect(mRes.res.json).toBeCalledWith(result);
        });

        it('Should call post update service and send error response correctly', async () => {
            const result = new ErrorResult()
            jest.spyOn(PostService, 'update').mockResolvedValueOnce(result);

            const mReq = getMockReq({ query: {}, params: { postId: mPostId }, body: postUpdate });
            const mRes = getMockRes({ locals: { tokenPayload: tokenPayload }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.update(mReq, mRes.res, mNext);

            expect(PostService.update).toBeCalled();
            expect(PostService.update).toBeCalledWith(mPostId, postUpdate, tokenPayload)
            expect(mRes.res.status).toBeCalledWith(400);
            expect(mRes.res.json).toBeCalledWith(result);
        });

        it('Should call post update service and handle thrown exception from service', async () => {
            jest.spyOn(PostService, 'update').mockImplementation(() => {
                throw new Error();
            });

            const mReq = getMockReq({ query: {}, params: { postId: mPostId }, body: postUpdate });
            const mRes = getMockRes({ locals: { tokenPayload: tokenPayload }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.update(mReq, mRes.res, mNext);

            expect(PostService.update).toBeCalled();
            expect(PostService.update).toBeCalledWith(mPostId, postUpdate, tokenPayload)
            expect(mNext).toBeCalled();
            expect(mRes.res.locals.err).toBeDefined();
            expect(mRes.res.locals.err).toBeInstanceOf(Error);
        });
    });

    describe('addComment', () => {
        const mPostId = "mock_value";

        const commentAdd: CommentAdd = {
            owner: "mock_value",
            comment: "mock_value",
        };

        const tokenPayload: TokenPayload = {
            id: "mock_data",
            status: Status.ACTIVE,
            username: "mock_data",
            email: "mock_data",
            role: "mock_data",
        }

        it('Should call post addComment service and send success response correctly', async () => {
            const result = new SuccessResult()
            jest.spyOn(PostService, 'addComment').mockResolvedValueOnce(result);

            const mReq = getMockReq({ query: {}, params: { postId: mPostId }, body: commentAdd });
            const mRes = getMockRes({ locals: { tokenPayload: tokenPayload }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.addComment(mReq, mRes.res, mNext);

            expect(PostService.addComment).toBeCalled();
            expect(PostService.addComment).toBeCalledWith(mPostId, commentAdd, tokenPayload)
            expect(mRes.res.status).toBeCalledWith(200);
            expect(mRes.res.json).toBeCalledWith(result);
        });

        it('Should call post addComment service and send error response correctly', async () => {
            const result = new ErrorResult()
            jest.spyOn(PostService, 'addComment').mockResolvedValueOnce(result);

            const mReq = getMockReq({ query: {}, params: { postId: mPostId }, body: commentAdd });
            const mRes = getMockRes({ locals: { tokenPayload: tokenPayload }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.addComment(mReq, mRes.res, mNext);

            expect(PostService.addComment).toBeCalled();
            expect(PostService.addComment).toBeCalledWith(mPostId, commentAdd, tokenPayload)
            expect(mRes.res.status).toBeCalledWith(400);
            expect(mRes.res.json).toBeCalledWith(result);
        });

        it('Should call post addComment service and handle thrown exception from service', async () => {
            jest.spyOn(PostService, 'addComment').mockImplementation(() => {
                throw new Error();
            });

            const mReq = getMockReq({ query: {}, params: { postId: mPostId }, body: commentAdd });
            const mRes = getMockRes({ locals: { tokenPayload: tokenPayload }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.addComment(mReq, mRes.res, mNext);

            expect(PostService.addComment).toBeCalled();
            expect(PostService.addComment).toBeCalledWith(mPostId, commentAdd, tokenPayload)
            expect(mNext).toBeCalled();
            expect(mRes.res.locals.err).toBeDefined();
            expect(mRes.res.locals.err).toBeInstanceOf(Error);
        });
    });

    describe('removeComment', () => {
        const mPostId = "mock_value";
        const mCommentId = "mock_value";

        const tokenPayload: TokenPayload = {
            id: "mock_data",
            status: Status.ACTIVE,
            username: "mock_data",
            email: "mock_data",
            role: "mock_data",
        }

        it('Should call post removeComment service and send success response correctly', async () => {
            const result = new SuccessResult()
            jest.spyOn(PostService, 'removeComment').mockResolvedValueOnce(result);

            const mReq = getMockReq({ query: {}, params: { postId: mPostId, commentId: mCommentId } });
            const mRes = getMockRes({ locals: { tokenPayload: tokenPayload }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.removeComment(mReq, mRes.res, mNext);

            expect(PostService.removeComment).toBeCalled();
            expect(PostService.removeComment).toBeCalledWith(mPostId, mCommentId, tokenPayload)
            expect(mRes.res.status).toBeCalledWith(200);
            expect(mRes.res.json).toBeCalledWith(result);
        });

        it('Should call post removeComment service and send error response correctly', async () => {
            const result = new ErrorResult()
            jest.spyOn(PostService, 'removeComment').mockResolvedValueOnce(result);

            const mReq = getMockReq({ query: {}, params: { postId: mPostId, commentId: mCommentId } });
            const mRes = getMockRes({ locals: { tokenPayload: tokenPayload }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.removeComment(mReq, mRes.res, mNext);

            expect(PostService.removeComment).toBeCalled();
            expect(PostService.removeComment).toBeCalledWith(mPostId, mCommentId, tokenPayload)
            expect(mRes.res.status).toBeCalledWith(400);
            expect(mRes.res.json).toBeCalledWith(result);
        });

        it('Should call post removeComment service and handle thrown exception from service', async () => {
            jest.spyOn(PostService, 'removeComment').mockImplementation(() => {
                throw new Error();
            });

            const mReq = getMockReq({ query: {}, params: { postId: mPostId, commentId: mCommentId } });
            const mRes = getMockRes({ locals: { tokenPayload: tokenPayload }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.removeComment(mReq, mRes.res, mNext);

            expect(PostService.removeComment).toBeCalled();
            expect(PostService.removeComment).toBeCalledWith(mPostId, mCommentId, tokenPayload)
            expect(mNext).toBeCalled();
            expect(mRes.res.locals.err).toBeDefined();
            expect(mRes.res.locals.err).toBeInstanceOf(Error);
        });
    });

    describe('remove', () => {
        const mPostId = "mock_value";

        const tokenPayload: TokenPayload = {
            id: "mock_data",
            status: Status.ACTIVE,
            username: "mock_data",
            email: "mock_data",
            role: "mock_data",
        }

        it('Should call post remove service and send success response correctly', async () => {
            const result = new SuccessResult()
            jest.spyOn(PostService, 'remove').mockResolvedValueOnce(result);

            const mReq = getMockReq({ query: {}, params: { id: mPostId } });
            const mRes = getMockRes({ locals: { tokenPayload: tokenPayload }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.remove(mReq, mRes.res, mNext);

            expect(PostService.remove).toBeCalled();
            expect(PostService.remove).toBeCalledWith(mPostId, tokenPayload)
            expect(mRes.res.status).toBeCalledWith(200);
            expect(mRes.res.json).toBeCalledWith(result);
        });

        it('Should call post remove service and send error response correctly', async () => {
            const result = new ErrorResult()
            jest.spyOn(PostService, 'remove').mockResolvedValueOnce(result);

            const mReq = getMockReq({ query: {}, params: { id: mPostId } });
            const mRes = getMockRes({ locals: { tokenPayload: tokenPayload }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.remove(mReq, mRes.res, mNext);

            expect(PostService.remove).toBeCalled();
            expect(PostService.remove).toBeCalledWith(mPostId, tokenPayload)
            expect(mRes.res.status).toBeCalledWith(400);
            expect(mRes.res.json).toBeCalledWith(result);
        });

        it('Should call post remove service and handle thrown exception from service', async () => {
            jest.spyOn(PostService, 'remove').mockImplementation(() => {
                throw new Error();
            });

            const mReq = getMockReq({ query: {}, params: { id: mPostId } });
            const mRes = getMockRes({ locals: { tokenPayload: tokenPayload }, status: jest.fn().mockReturnThis(), send: jest.fn() });
            const mNext = jest.fn();

            await PostController.remove(mReq, mRes.res, mNext);

            expect(PostService.remove).toBeCalled();
            expect(PostService.remove).toBeCalledWith(mPostId, tokenPayload)
            expect(mNext).toBeCalled();
            expect(mRes.res.locals.err).toBeDefined();
            expect(mRes.res.locals.err).toBeInstanceOf(Error);
        });
    });

});