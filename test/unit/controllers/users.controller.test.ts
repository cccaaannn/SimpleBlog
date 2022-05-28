import { getMockReq, getMockRes } from '@jest-mock/express'

import UserController from "../../../src/controllers/users.controller";
import UserService from "../../../src/services/user.service"
import Roles from "../../../src/core/types/enums/Roles";

import { ErrorResult, SuccessResult } from '../../../src/core/results/Result';
import { MockValues } from '../../utils/mocks/const-mock-values';


describe('User controller', () => {

	describe('getAll', () => {

		test('Success', async () => {
			jest.spyOn(UserService, 'getAll').mockResolvedValueOnce(MockValues.mSuccessDataResultPaginationUsers);

			const mReq = getMockReq({ query: {} });
			const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.getAll(mReq, mRes.res, mNext);

			expect(UserService.getAll).toBeCalled();
			expect(UserService.getAll).toBeCalledWith(MockValues.mPaginatorUsersGetAllEmpty);
			expect(mRes.res.status).toBeCalledWith(200);
			expect(mRes.res.json).toBeCalledWith(MockValues.mSuccessDataResultPaginationUsers);
		});

		test('Error', async () => {
			jest.spyOn(UserService, 'getAll').mockResolvedValueOnce(MockValues.mErrorDataResult as any);

			const mReq = getMockReq({ query: {} });
			const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.getAll(mReq, mRes.res, mNext);

			expect(UserService.getAll).toBeCalled();
			expect(UserService.getAll).toBeCalledWith(MockValues.mPaginatorUsersGetAllEmpty);
			expect(mRes.res.status).toBeCalledWith(400);
			expect(mRes.res.json).toBeCalledWith(MockValues.mErrorDataResult);
		});

		test('Exception', async () => {
			jest.spyOn(UserService, 'getAll').mockImplementation(() => {
				throw new Error();
			});

			const mReq = getMockReq({ query: {} });
			const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.getAll(mReq, mRes.res, mNext);

			expect(UserService.getAll).toBeCalled();
			expect(UserService.getAll).toBeCalledWith(MockValues.mPaginatorUsersGetAllEmpty);
			expect(mNext).toBeCalled();
			expect(mRes.res.locals.err).toBeDefined();
			expect(mRes.res.locals.err).toBeInstanceOf(Error);
		});

	});

	describe('getById', () => {

		test('Success', async () => {
			jest.spyOn(UserService, 'getById').mockResolvedValueOnce(MockValues.mSuccessDataResultUser1);

			const mReq = getMockReq({ query: {}, params: { id: MockValues.mUserId1 } });
			const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.getById(mReq, mRes.res, mNext);

			expect(UserService.getById).toBeCalled();
			expect(UserService.getById).toBeCalledWith(MockValues.mUserId1)
			expect(mRes.res.status).toBeCalledWith(200);
			expect(mRes.res.json).toBeCalledWith(MockValues.mSuccessDataResultUser1);
		});

		test('Error', async () => {
			jest.spyOn(UserService, 'getById').mockResolvedValueOnce(MockValues.mErrorDataResult);

			const mReq = getMockReq({ query: {}, params: { id: MockValues.mUserId1 } });
			const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.getById(mReq, mRes.res, mNext);

			expect(UserService.getById).toBeCalled();
			expect(UserService.getById).toBeCalledWith(MockValues.mUserId1)
			expect(mRes.res.status).toBeCalledWith(400);
			expect(mRes.res.json).toBeCalledWith(MockValues.mErrorDataResult);
		});

		test('Exception', async () => {
			jest.spyOn(UserService, 'getById').mockImplementation(() => {
				throw new Error();
			});

			const mReq = getMockReq({ query: {}, params: { id: MockValues.mUserId1 } });
			const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.getById(mReq, mRes.res, mNext);

			expect(UserService.getById).toBeCalled();
			expect(UserService.getById).toBeCalledWith(MockValues.mUserId1)
			expect(mNext).toBeCalled();
			expect(mRes.res.locals.err).toBeDefined();
			expect(mRes.res.locals.err).toBeInstanceOf(Error);
		});

	});

	describe('update', () => {

		test('Success', async () => {
			const result = new SuccessResult()
			jest.spyOn(UserService, 'update').mockResolvedValueOnce(result);

			const mReq = getMockReq({ query: {}, params: { id: MockValues.mUserId1 }, body: MockValues.mUserToUpdate });
			const mRes = getMockRes({ locals: { tokenPayload: MockValues.mTokenPayloadUser1 }, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.update(mReq, mRes.res, mNext);

			expect(UserService.update).toBeCalled();
			expect(UserService.update).toBeCalledWith(MockValues.mUserId1, MockValues.mUserToUpdate, MockValues.mTokenPayloadUser1)
			expect(mRes.res.status).toBeCalledWith(200);
			expect(mRes.res.json).toBeCalledWith(result);
		});

		test('Error', async () => {
			const result = new ErrorResult()
			jest.spyOn(UserService, 'update').mockResolvedValueOnce(result);

			const mReq = getMockReq({ query: {}, params: { id: MockValues.mUserId1 }, body: MockValues.mUserToUpdate });
			const mRes = getMockRes({ locals: { tokenPayload: MockValues.mTokenPayloadUser1 }, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.update(mReq, mRes.res, mNext);

			expect(UserService.update).toBeCalled();
			expect(UserService.update).toBeCalledWith(MockValues.mUserId1, MockValues.mUserToUpdate, MockValues.mTokenPayloadUser1)
			expect(mRes.res.status).toBeCalledWith(400);
			expect(mRes.res.json).toBeCalledWith(result);
		});

		test('Exception', async () => {
			jest.spyOn(UserService, 'update').mockImplementation(() => {
				throw new Error();
			});

			const mReq = getMockReq({ query: {}, params: { id: MockValues.mUserId1 }, body: MockValues.mUserToUpdate });
			const mRes = getMockRes({ locals: { tokenPayload: MockValues.mTokenPayloadUser1 }, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.update(mReq, mRes.res, mNext);

			expect(UserService.update).toBeCalled();
			expect(UserService.update).toBeCalledWith(MockValues.mUserId1, MockValues.mUserToUpdate, MockValues.mTokenPayloadUser1)
			expect(mNext).toBeCalled();
			expect(mRes.res.locals.err).toBeDefined();
			expect(mRes.res.locals.err).toBeInstanceOf(Error);
		});

	});

	describe('changeRole', () => {

		test('Success', async () => {
			const result = new SuccessResult()
			jest.spyOn(UserService, 'changeRole').mockResolvedValueOnce(result);

			const mReq = getMockReq({ query: {}, params: { id: MockValues.mUserId1, role: Roles.ADMIN } });
			const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.changeRole(mReq, mRes.res, mNext);

			expect(UserService.changeRole).toBeCalled();
			expect(UserService.changeRole).toBeCalledWith(MockValues.mUserId1, Roles.ADMIN)
			expect(mRes.res.status).toBeCalledWith(200);
			expect(mRes.res.json).toBeCalledWith(result);
		});

		test('Error', async () => {
			const result = new ErrorResult()
			jest.spyOn(UserService, 'changeRole').mockResolvedValueOnce(result);

			const mReq = getMockReq({ query: {}, params: { id: MockValues.mUserId1, role: Roles.ADMIN } });
			const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.changeRole(mReq, mRes.res, mNext);

			expect(UserService.changeRole).toBeCalled();
			expect(UserService.changeRole).toBeCalledWith(MockValues.mUserId1, Roles.ADMIN)
			expect(mRes.res.status).toBeCalledWith(400);
			expect(mRes.res.json).toBeCalledWith(result);
		});

		test('Exception', async () => {
			jest.spyOn(UserService, 'changeRole').mockImplementation(() => {
				throw new Error();
			});

			const mReq = getMockReq({ query: {}, params: { id: MockValues.mUserId1, role: Roles.ADMIN } });
			const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.changeRole(mReq, mRes.res, mNext);

			expect(UserService.changeRole).toBeCalled();
			expect(UserService.changeRole).toBeCalledWith(MockValues.mUserId1, Roles.ADMIN)
			expect(mNext).toBeCalled();
			expect(mRes.res.locals.err).toBeDefined();
			expect(mRes.res.locals.err).toBeInstanceOf(Error);
		});

	});

	describe('suspend', () => {

		test('Success', async () => {
			const result = new SuccessResult()
			jest.spyOn(UserService, 'suspend').mockResolvedValueOnce(result);

			const mReq = getMockReq({ query: {}, params: { id: MockValues.mUserId1 } });
			const mRes = getMockRes({ locals: { tokenPayload: MockValues.mTokenPayloadUser1 }, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.suspend(mReq, mRes.res, mNext);

			expect(UserService.suspend).toBeCalled();
			expect(UserService.suspend).toBeCalledWith(MockValues.mUserId1, MockValues.mTokenPayloadUser1)
			expect(mRes.res.status).toBeCalledWith(200);
			expect(mRes.res.json).toBeCalledWith(result);
		});

		test('Error', async () => {
			const result = new ErrorResult()
			jest.spyOn(UserService, 'suspend').mockResolvedValueOnce(result);

			const mReq = getMockReq({ query: {}, params: { id: MockValues.mUserId1 } });
			const mRes = getMockRes({ locals: { tokenPayload: MockValues.mTokenPayloadUser1 }, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.suspend(mReq, mRes.res, mNext);

			expect(UserService.suspend).toBeCalled();
			expect(UserService.suspend).toBeCalledWith(MockValues.mUserId1, MockValues.mTokenPayloadUser1)
			expect(mRes.res.status).toBeCalledWith(400);
			expect(mRes.res.json).toBeCalledWith(result);
		});

		test('Exception', async () => {
			jest.spyOn(UserService, 'suspend').mockImplementation(() => {
				throw new Error();
			});

			const mReq = getMockReq({ query: {}, params: { id: MockValues.mUserId1 } });
			const mRes = getMockRes({ locals: { tokenPayload: MockValues.mTokenPayloadUser1 }, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.suspend(mReq, mRes.res, mNext);

			expect(UserService.suspend).toBeCalled();
			expect(UserService.suspend).toBeCalledWith(MockValues.mUserId1, MockValues.mTokenPayloadUser1)
			expect(mNext).toBeCalled();
			expect(mRes.res.locals.err).toBeDefined();
			expect(mRes.res.locals.err).toBeInstanceOf(Error);
		});

	});

	describe('activate', () => {

		test('Success', async () => {
			const result = new SuccessResult()
			jest.spyOn(UserService, 'activate').mockResolvedValueOnce(result);

			const mReq = getMockReq({ query: {}, params: { id: MockValues.mUserId1 } });
			const mRes = getMockRes({ locals: { tokenPayload: MockValues.mTokenPayloadUser1 }, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.activate(mReq, mRes.res, mNext);

			expect(UserService.activate).toBeCalled();
			expect(UserService.activate).toBeCalledWith(MockValues.mUserId1, MockValues.mTokenPayloadUser1)
			expect(mRes.res.status).toBeCalledWith(200);
			expect(mRes.res.json).toBeCalledWith(result);
		});

		test('Error', async () => {
			const result = new ErrorResult()
			jest.spyOn(UserService, 'activate').mockResolvedValueOnce(result);

			const mReq = getMockReq({ query: {}, params: { id: MockValues.mUserId1 } });
			const mRes = getMockRes({ locals: { tokenPayload: MockValues.mTokenPayloadUser1 }, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.activate(mReq, mRes.res, mNext);

			expect(UserService.activate).toBeCalled();
			expect(UserService.activate).toBeCalledWith(MockValues.mUserId1, MockValues.mTokenPayloadUser1)
			expect(mRes.res.status).toBeCalledWith(400);
			expect(mRes.res.json).toBeCalledWith(result);
		});

		test('Exception', async () => {
			jest.spyOn(UserService, 'activate').mockImplementation(() => {
				throw new Error();
			});

			const mReq = getMockReq({ query: {}, params: { id: MockValues.mUserId1 } });
			const mRes = getMockRes({ locals: { tokenPayload: MockValues.mTokenPayloadUser1 }, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.activate(mReq, mRes.res, mNext);

			expect(UserService.activate).toBeCalled();
			expect(UserService.activate).toBeCalledWith(MockValues.mUserId1, MockValues.mTokenPayloadUser1)
			expect(mNext).toBeCalled();
			expect(mRes.res.locals.err).toBeDefined();
			expect(mRes.res.locals.err).toBeInstanceOf(Error);
		});

	});

	describe('remove', () => {

		test('Success', async () => {
			const result = new SuccessResult()
			jest.spyOn(UserService, 'remove').mockResolvedValueOnce(result);

			const mReq = getMockReq({ query: {}, params: { id: MockValues.mUserId1 } });
			const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.remove(mReq, mRes.res, mNext);

			expect(UserService.remove).toBeCalled();
			expect(UserService.remove).toBeCalledWith(MockValues.mUserId1)
			expect(mRes.res.status).toBeCalledWith(200);
			expect(mRes.res.json).toBeCalledWith(result);
		});

		test('Error', async () => {
			const result = new ErrorResult()
			jest.spyOn(UserService, 'remove').mockResolvedValueOnce(result);

			const mReq = getMockReq({ query: {}, params: { id: MockValues.mUserId1 } });
			const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.remove(mReq, mRes.res, mNext);

			expect(UserService.remove).toBeCalled();
			expect(UserService.remove).toBeCalledWith(MockValues.mUserId1)
			expect(mRes.res.status).toBeCalledWith(400);
			expect(mRes.res.json).toBeCalledWith(result);
		});

		test('Exception', async () => {
			jest.spyOn(UserService, 'remove').mockImplementation(() => {
				throw new Error();
			});

			const mReq = getMockReq({ query: {}, params: { id: MockValues.mUserId1 } });
			const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.remove(mReq, mRes.res, mNext);

			expect(UserService.remove).toBeCalled();
			expect(UserService.remove).toBeCalledWith(MockValues.mUserId1)
			expect(mNext).toBeCalled();
			expect(mRes.res.locals.err).toBeDefined();
			expect(mRes.res.locals.err).toBeInstanceOf(Error);
		});

	});

	describe('purge', () => {

		test('Success', async () => {
			const result = new SuccessResult()
			jest.spyOn(UserService, 'purge').mockResolvedValueOnce(result);

			const mReq = getMockReq({ query: {}, params: { id: MockValues.mUserId1 } });
			const mRes = getMockRes({ locals: { tokenPayload: MockValues.mTokenPayloadUser1 }, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.purge(mReq, mRes.res, mNext);

			expect(UserService.purge).toBeCalled();
			expect(UserService.purge).toBeCalledWith(MockValues.mUserId1, MockValues.mTokenPayloadUser1)
			expect(mRes.res.status).toBeCalledWith(200);
			expect(mRes.res.json).toBeCalledWith(result);
		});

		test('Error', async () => {
			const result = new ErrorResult()
			jest.spyOn(UserService, 'purge').mockResolvedValueOnce(result);

			const mReq = getMockReq({ query: {}, params: { id: MockValues.mUserId1 } });
			const mRes = getMockRes({ locals: { tokenPayload: MockValues.mTokenPayloadUser1 }, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.purge(mReq, mRes.res, mNext);

			expect(UserService.purge).toBeCalled();
			expect(UserService.purge).toBeCalledWith(MockValues.mUserId1, MockValues.mTokenPayloadUser1)
			expect(mRes.res.status).toBeCalledWith(400);
			expect(mRes.res.json).toBeCalledWith(result);
		});

		test('Exception', async () => {
			jest.spyOn(UserService, 'purge').mockImplementation(() => {
				throw new Error();
			});

			const mReq = getMockReq({ query: {}, params: { id: MockValues.mUserId1 } });
			const mRes = getMockRes({ locals: { tokenPayload: MockValues.mTokenPayloadUser1 }, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.purge(mReq, mRes.res, mNext);

			expect(UserService.purge).toBeCalled();
			expect(UserService.purge).toBeCalledWith(MockValues.mUserId1, MockValues.mTokenPayloadUser1)
			expect(mNext).toBeCalled();
			expect(mRes.res.locals.err).toBeDefined();
			expect(mRes.res.locals.err).toBeInstanceOf(Error);
		});

	});

});