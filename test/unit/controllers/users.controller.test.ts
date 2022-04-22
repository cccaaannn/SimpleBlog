import { getMockReq, getMockRes } from '@jest-mock/express'

import UserController from "../../../src/controllers/users.controller";
import UserService from "../../../src/services/user.service"
import Roles from "../../../src/core/types/enums/Roles";
import Status from "../../../src/types/enums/Status";
import { ErrorDataResult, SuccessDataResult } from "../../../src/core/results/DataResult";
import { User, UserSort, UserUpdate } from "../../../src/types/User";
import { ErrorResult, SuccessResult } from '../../../src/core/results/Result';
import { TokenPayload } from '../../../src/core/types/TokenPayload';


describe('User controller', () => {

	describe('getAll', () => {
		const mUsers: SuccessDataResult<User[]> = {
			status: true,
			data: [
				{
					_id: "test_id_hash1",
					status: Status.ACTIVE,
					username: "test1",
					email: "test1@test1",
					password: "test_pass_hash1",
					role: Roles.ADMIN,
					dateCreated: new Date()
				}
			]
		}

		const mErrorResult: ErrorDataResult<User[]> = {
			status: false,
			data: []
		}

		it('Should call user getAll service and send success response correctly', async () => {
			jest.spyOn(UserService, 'getAll').mockResolvedValueOnce(mUsers as SuccessDataResult<User[]>);

			const mReq = getMockReq({ query: {} });
			const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.getAll(mReq, mRes.res, mNext);

			expect(UserService.getAll).toBeCalled();
			expect(mRes.res.status).toBeCalledWith(200);
			expect(mRes.res.json).toBeCalledWith(mUsers);
		});

		it('Should call user getAll service with query parameters and send success response correctly', async () => {
			const mUserSort: UserSort = {
                username: 1
            }

			jest.spyOn(UserService, 'getAll').mockResolvedValueOnce(mUsers as SuccessDataResult<User[]>);

			const mReq = getMockReq({ query: { field: "username", asc: 1 } });
			const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.getAll(mReq, mRes.res, mNext);

			expect(UserService.getAll).toBeCalled();
			expect(UserService.getAll).toBeCalledWith(mUserSort)
			expect(mRes.res.status).toBeCalledWith(200);
			expect(mRes.res.json).toBeCalledWith(mUsers);
		});

		it('Should call user getAll service and send error response correctly', async () => {
			jest.spyOn(UserService, 'getAll').mockResolvedValueOnce(mErrorResult as ErrorDataResult<User[]>);

			const mReq = getMockReq({ query: {} });
			const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.getAll(mReq, mRes.res, mNext);

			expect(UserService.getAll).toBeCalled();
			expect(mRes.res.status).toBeCalledWith(400);
			expect(mRes.res.json).toBeCalledWith(mErrorResult);
		});

		it('Should call user getAll service and handle thrown exception from service', async () => {
			jest.spyOn(UserService, 'getAll').mockImplementation(() => {
				throw new Error();
			});

			const mReq = getMockReq({ query: {} });
			const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.getAll(mReq, mRes.res, mNext);

			expect(UserService.getAll).toBeCalled();
			expect(mNext).toBeCalled();
			expect(mRes.res.locals.err).toBeDefined();
			expect(mRes.res.locals.err).toBeInstanceOf(Error);
		});
	});

	describe('getById', () => {
		const mId = "mock_value";
		const mUser: SuccessDataResult<User> = {
			status: true,
			data:
			{
				_id: "test_id_hash1",
				status: Status.ACTIVE,
				username: "test1",
				email: "test1@test1",
				password: "test_pass_hash1",
				role: Roles.ADMIN,
				dateCreated: new Date()
			}
		}

		const mErrorResult: ErrorDataResult<User | null> = {
			status: false,
			data: null
		}

		it('Should call user getById service and send success response correctly', async () => {
			jest.spyOn(UserService, 'getById').mockResolvedValueOnce(mUser as SuccessDataResult<User>);

			const mReq = getMockReq({ query: {}, params: { id: mId } });
			const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.getById(mReq, mRes.res, mNext);

			expect(UserService.getById).toBeCalled();
			expect(UserService.getById).toBeCalledWith(mId)
			expect(mRes.res.status).toBeCalledWith(200);
			expect(mRes.res.json).toBeCalledWith(mUser);
		});

		it('Should call user getById service and send error response correctly', async () => {
			jest.spyOn(UserService, 'getById').mockResolvedValueOnce(mErrorResult as ErrorDataResult<User>);

			const mReq = getMockReq({ query: {}, params: { id: mId } });
			const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.getById(mReq, mRes.res, mNext);

			expect(UserService.getById).toBeCalled();
			expect(UserService.getById).toBeCalledWith(mId)
			expect(mRes.res.status).toBeCalledWith(400);
			expect(mRes.res.json).toBeCalledWith(mErrorResult);
		});

		it('Should call user getById service and handle thrown exception from service', async () => {
			jest.spyOn(UserService, 'getById').mockImplementation(() => {
				throw new Error();
			});

			const mReq = getMockReq({ query: {}, params: { id: mId } });
			const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.getById(mReq, mRes.res, mNext);

			expect(UserService.getById).toBeCalled();
			expect(UserService.getById).toBeCalledWith(mId)
			expect(mNext).toBeCalled();
			expect(mRes.res.locals.err).toBeDefined();
			expect(mRes.res.locals.err).toBeInstanceOf(Error);
		});
	});

	describe('update', () => {
		const mId = "mock_value";
		const mUserUpdate: UserUpdate = {
			username: "test",
			password: "asd"
		};

		const tokenPayload: TokenPayload = {
			id: "mock_data",
			status: Status.ACTIVE,
			username: "mock_data",
			email: "mock_data",
			role: "mock_data",
		}

		it('Should call user update service and send success response correctly', async () => {
			const result = new SuccessResult()
			jest.spyOn(UserService, 'update').mockResolvedValueOnce(result);

			const mReq = getMockReq({ query: {}, params: { id: mId }, body: mUserUpdate });
			const mRes = getMockRes({ locals: { tokenPayload: tokenPayload }, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.update(mReq, mRes.res, mNext);

			expect(UserService.update).toBeCalled();
			expect(UserService.update).toBeCalledWith(mId, mUserUpdate, tokenPayload)
			expect(mRes.res.status).toBeCalledWith(200);
			expect(mRes.res.json).toBeCalledWith(result);
		});

		it('Should call user update service and send error response correctly', async () => {
			const result = new ErrorResult()
			jest.spyOn(UserService, 'update').mockResolvedValueOnce(result);

			const mReq = getMockReq({ query: {}, params: { id: mId }, body: mUserUpdate });
			const mRes = getMockRes({ locals: { tokenPayload: tokenPayload }, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.update(mReq, mRes.res, mNext);

			expect(UserService.update).toBeCalled();
			expect(UserService.update).toBeCalledWith(mId, mUserUpdate, tokenPayload)
			expect(mRes.res.status).toBeCalledWith(400);
			expect(mRes.res.json).toBeCalledWith(result);
		});

		it('Should call user update service and handle thrown exception from service', async () => {
			jest.spyOn(UserService, 'update').mockImplementation(() => {
				throw new Error();
			});

			const mReq = getMockReq({ query: {}, params: { id: mId }, body: mUserUpdate });
			const mRes = getMockRes({ locals: { tokenPayload: tokenPayload }, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.update(mReq, mRes.res, mNext);

			expect(UserService.update).toBeCalled();
			expect(UserService.update).toBeCalledWith(mId, mUserUpdate, tokenPayload)
			expect(mNext).toBeCalled();
			expect(mRes.res.locals.err).toBeDefined();
			expect(mRes.res.locals.err).toBeInstanceOf(Error);
		});
	});

	describe('changeRole', () => {
		const mId = "mock_value";
		const mRole = Roles.ADMIN;

		it('Should call user changeRole service and send success response correctly', async () => {
			const result = new SuccessResult()
			jest.spyOn(UserService, 'changeRole').mockResolvedValueOnce(result);

			const mReq = getMockReq({ query: {}, params: { id: mId, role: mRole } });
			const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.changeRole(mReq, mRes.res, mNext);

			expect(UserService.changeRole).toBeCalled();
			expect(UserService.changeRole).toBeCalledWith(mId, mRole)
			expect(mRes.res.status).toBeCalledWith(200);
			expect(mRes.res.json).toBeCalledWith(result);
		});

		it('Should call user changeRole service and send error response correctly', async () => {
			const result = new ErrorResult()
			jest.spyOn(UserService, 'changeRole').mockResolvedValueOnce(result);

			const mReq = getMockReq({ query: {}, params: { id: mId, role: mRole } });
			const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.changeRole(mReq, mRes.res, mNext);

			expect(UserService.changeRole).toBeCalled();
			expect(UserService.changeRole).toBeCalledWith(mId, mRole)
			expect(mRes.res.status).toBeCalledWith(400);
			expect(mRes.res.json).toBeCalledWith(result);
		});

		it('Should call user changeRole service and handle thrown exception from service', async () => {
			jest.spyOn(UserService, 'changeRole').mockImplementation(() => {
				throw new Error();
			});

			const mReq = getMockReq({ query: {}, params: { id: mId, role: mRole } });
			const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.changeRole(mReq, mRes.res, mNext);

			expect(UserService.changeRole).toBeCalled();
			expect(UserService.changeRole).toBeCalledWith(mId, mRole)
			expect(mNext).toBeCalled();
			expect(mRes.res.locals.err).toBeDefined();
			expect(mRes.res.locals.err).toBeInstanceOf(Error);
		});
	});

	describe('suspend', () => {
		const mId = "mock_value";

		it('Should call user suspend service and send success response correctly', async () => {
			const result = new SuccessResult()
			jest.spyOn(UserService, 'suspend').mockResolvedValueOnce(result);

			const mReq = getMockReq({ query: {}, params: { id: mId } });
			const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.suspend(mReq, mRes.res, mNext);

			expect(UserService.suspend).toBeCalled();
			expect(UserService.suspend).toBeCalledWith(mId)
			expect(mRes.res.status).toBeCalledWith(200);
			expect(mRes.res.json).toBeCalledWith(result);
		});

		it('Should call user suspend service and send error response correctly', async () => {
			const result = new ErrorResult()
			jest.spyOn(UserService, 'suspend').mockResolvedValueOnce(result);

			const mReq = getMockReq({ query: {}, params: { id: mId } });
			const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.suspend(mReq, mRes.res, mNext);

			expect(UserService.suspend).toBeCalled();
			expect(UserService.suspend).toBeCalledWith(mId)
			expect(mRes.res.status).toBeCalledWith(400);
			expect(mRes.res.json).toBeCalledWith(result);
		});

		it('Should call user suspend service and handle thrown exception from service', async () => {
			jest.spyOn(UserService, 'suspend').mockImplementation(() => {
				throw new Error();
			});

			const mReq = getMockReq({ query: {}, params: { id: mId } });
			const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.suspend(mReq, mRes.res, mNext);

			expect(UserService.suspend).toBeCalled();
			expect(UserService.suspend).toBeCalledWith(mId)
			expect(mNext).toBeCalled();
			expect(mRes.res.locals.err).toBeDefined();
			expect(mRes.res.locals.err).toBeInstanceOf(Error);
		});
	});

	describe('activate', () => {
		const mId = "mock_value" 

		it('Should call user activate service and send success response correctly', async () => {
			const result = new SuccessResult()
			jest.spyOn(UserService, 'activate').mockResolvedValueOnce(result);

			const mReq = getMockReq({ query: {}, params: { id: mId } });
			const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.activate(mReq, mRes.res, mNext);

			expect(UserService.activate).toBeCalled();
			expect(UserService.activate).toBeCalledWith(mId)
			expect(mRes.res.status).toBeCalledWith(200);
			expect(mRes.res.json).toBeCalledWith(result);
		});

		it('Should call user activate service and send error response correctly', async () => {
			const result = new ErrorResult()
			jest.spyOn(UserService, 'activate').mockResolvedValueOnce(result);

			const mReq = getMockReq({ query: {}, params: { id: mId } });
			const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.activate(mReq, mRes.res, mNext);

			expect(UserService.activate).toBeCalled();
			expect(UserService.activate).toBeCalledWith(mId)
			expect(mRes.res.status).toBeCalledWith(400);
			expect(mRes.res.json).toBeCalledWith(result);
		});

		it('Should call user activate service and handle thrown exception from service', async () => {
			jest.spyOn(UserService, 'activate').mockImplementation(() => {
				throw new Error();
			});

			const mReq = getMockReq({ query: {}, params: { id: mId } });
			const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.activate(mReq, mRes.res, mNext);

			expect(UserService.activate).toBeCalled();
			expect(UserService.activate).toBeCalledWith(mId)
			expect(mNext).toBeCalled();
			expect(mRes.res.locals.err).toBeDefined();
			expect(mRes.res.locals.err).toBeInstanceOf(Error);
		});
	});

	describe('remove', () => {
		const mId = "mock_value" 

		it('Should call user remove service and send success response correctly', async () => {
			const result = new SuccessResult()
			jest.spyOn(UserService, 'remove').mockResolvedValueOnce(result);

			const mReq = getMockReq({ query: {}, params: { id: mId } });
			const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.remove(mReq, mRes.res, mNext);

			expect(UserService.remove).toBeCalled();
			expect(UserService.remove).toBeCalledWith(mId)
			expect(mRes.res.status).toBeCalledWith(200);
			expect(mRes.res.json).toBeCalledWith(result);
		});

		it('Should call user remove service and send error response correctly', async () => {
			const result = new ErrorResult()
			jest.spyOn(UserService, 'remove').mockResolvedValueOnce(result);

			const mReq = getMockReq({ query: {}, params: { id: mId } });
			const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.remove(mReq, mRes.res, mNext);

			expect(UserService.remove).toBeCalled();
			expect(UserService.remove).toBeCalledWith(mId)
			expect(mRes.res.status).toBeCalledWith(400);
			expect(mRes.res.json).toBeCalledWith(result);
		});

		it('Should call user remove service and handle thrown exception from service', async () => {
			jest.spyOn(UserService, 'remove').mockImplementation(() => {
				throw new Error();
			});

			const mReq = getMockReq({ query: {}, params: { mId } });
			const mRes = getMockRes({ locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.remove(mReq, mRes.res, mNext);

			expect(UserService.remove).toBeCalled();
			expect(UserService.remove).toBeCalledWith(mId)
			expect(mNext).toBeCalled();
			expect(mRes.res.locals.err).toBeDefined();
			expect(mRes.res.locals.err).toBeInstanceOf(Error);
		});
	});

	describe('purge', () => {
		const mId = "mock_value" 

		const tokenPayload: TokenPayload = {
			id: "mock_data",
			status: Status.ACTIVE,
			username: "mock_data",
			email: "mock_data",
			role: "mock_data",
		}

		it('Should call user purge service and send success response correctly', async () => {
			const result = new SuccessResult()
			jest.spyOn(UserService, 'purge').mockResolvedValueOnce(result);

			const mReq = getMockReq({ query: {}, params: { id: mId } });
			const mRes = getMockRes({ locals: { tokenPayload: tokenPayload }, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.purge(mReq, mRes.res, mNext);

			expect(UserService.purge).toBeCalled();
			expect(UserService.purge).toBeCalledWith(mId, tokenPayload)
			expect(mRes.res.status).toBeCalledWith(200);
			expect(mRes.res.json).toBeCalledWith(result);
		});

		it('Should call user purge service and send error response correctly', async () => {
			const result = new ErrorResult()
			jest.spyOn(UserService, 'purge').mockResolvedValueOnce(result);

			const mReq = getMockReq({ query: {}, params: { id: mId } });
			const mRes = getMockRes({ locals: { tokenPayload: tokenPayload }, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.purge(mReq, mRes.res, mNext);

			expect(UserService.purge).toBeCalled();
			expect(UserService.purge).toBeCalledWith(mId, tokenPayload)
			expect(mRes.res.status).toBeCalledWith(400);
			expect(mRes.res.json).toBeCalledWith(result);
		});

		it('Should call user purge service and handle thrown exception from service', async () => {
			jest.spyOn(UserService, 'purge').mockImplementation(() => {
				throw new Error();
			});

			const mReq = getMockReq({ query: {}, params: { id: mId } });
			const mRes = getMockRes({ locals: { tokenPayload: tokenPayload }, status: jest.fn().mockReturnThis(), send: jest.fn() });
			const mNext = jest.fn();

			await UserController.purge(mReq, mRes.res, mNext);

			expect(UserService.purge).toBeCalled();
			expect(UserService.purge).toBeCalledWith(mId, tokenPayload)
			expect(mNext).toBeCalled();
			expect(mRes.res.locals.err).toBeDefined();
			expect(mRes.res.locals.err).toBeInstanceOf(Error);
		});
	});

});