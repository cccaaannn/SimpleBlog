import EncryptionService from "../../../src/core/services/encryption.service";
import UserService from "../../../src/services/user.service"
import Roles from "../../../src/core/types/enums/Roles";
import Status from "../../../src/core/types/enums/Status";

import { ErrorDataResult, SuccessDataResult } from "../../../src/core/results/DataResult";
import { ErrorResult, SuccessResult } from '../../../src/core/results/Result';
import { MockValues } from "../../utils/mocks/const-mock-values";
import { UserModel } from '../../../src/models/UserModel';
import { PostModel } from "../../../src/models/PostModel";
import { User } from "../../../src/types/User";


describe('User service', () => {

    describe('getAll', () => {

        test('Get all users', async () => {
            jest.spyOn(UserModel, "countDocuments").mockResolvedValueOnce(1);

            jest.spyOn(UserModel, 'find').mockImplementationOnce((params: any) => {
                return MockValues.mUsersGetAllQuery;
            });

            const result = await UserService.getAll(MockValues.mPaginatorUsersGetAllEmpty);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toBeCalledWith({ status: { $ne: Status.DELETED } });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessDataResult);
        });

        test('Get all users with parameters', async () => {
            jest.spyOn(UserModel, "countDocuments").mockResolvedValueOnce(1);

            jest.spyOn(UserModel, 'find').mockImplementationOnce((params: any) => {
                return MockValues.mUsersGetAllQuery;
            });

            const result = await UserService.getAll(MockValues.mPaginatorUsersGetAllFull);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toBeCalledWith({ status: { $ne: Status.DELETED } });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessDataResult);
        });

    });

    describe('getById', () => {

        test('Get user by id', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(MockValues.mUsersFull as User[]);
            jest.spyOn(UserModel, 'findById').mockResolvedValueOnce(MockValues.mUser1 as User);

            const result = await UserService.getById(MockValues.mUserId1);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toBeCalledWith({ _id: MockValues.mUserId1, status: { $ne: Status.DELETED } });
            expect(UserModel.findById).toBeCalled();
            expect(UserModel.findById).toBeCalledWith(MockValues.mUserId1);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessDataResult);
        });

        test('Get non existing user by id', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(MockValues.mUsersEmpty as User[]);

            const result = await UserService.getById(MockValues.mUserId1);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toBeCalledWith({ _id: MockValues.mUserId1, status: { $ne: Status.DELETED } });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorDataResult);
        });

    });

    describe('getByUsername', () => {

        test('Get user by username', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(MockValues.mUsersFull as User[]);
            jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(MockValues.mUser1 as User);

            const result = await UserService.getByUsername(MockValues.mUsername1);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toBeCalledWith({ username: MockValues.mUsername1, status: { $ne: Status.DELETED } });
            expect(UserModel.findOne).toBeCalled();
            expect(UserModel.findOne).toBeCalledWith({ username: MockValues.mUsername1, status: { $ne: Status.DELETED } });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessDataResult);
        });

        test('Get non existing user by username', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(MockValues.mUsersEmpty as User[]);

            const result = await UserService.getByUsername(MockValues.mUsername1);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toBeCalledWith({ username: MockValues.mUsername1, status: { $ne: Status.DELETED } });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorDataResult);
        });

        test('Db returns null', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(MockValues.mUsersFull as User[]);
            jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(null);

            const result = await UserService.getByUsername(MockValues.mUsername1);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toBeCalledWith({ username: MockValues.mUsername1, status: { $ne: Status.DELETED } });
            expect(UserModel.findOne).toBeCalled();
            expect(UserModel.findOne).toBeCalledWith({ username: MockValues.mUsername1, status: { $ne: Status.DELETED } });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorDataResult);
        });

    });

    describe('getByEmail', () => {

        test('Get user by email', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(MockValues.mUsersFull as User[]);
            jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(MockValues.mUser1 as User);

            const result = await UserService.getByEmail(MockValues.mEmail1);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toBeCalledWith({ email: MockValues.mEmail1, status: { $ne: Status.DELETED } });
            expect(UserModel.findOne).toBeCalled();
            expect(UserModel.findOne).toBeCalledWith({ email: MockValues.mEmail1, status: { $ne: Status.DELETED } });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessDataResult);
        });

        test('Get non existing user by email', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(MockValues.mUsersEmpty as User[]);

            const result = await UserService.getByEmail(MockValues.mEmail1);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toBeCalledWith({ email: MockValues.mEmail1, status: { $ne: Status.DELETED } });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorDataResult);
        });

        test('Db returns null', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(MockValues.mUsersFull as User[]);
            jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(null);

            const result = await UserService.getByEmail(MockValues.mEmail1);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toBeCalledWith({ email: MockValues.mEmail1, status: { $ne: Status.DELETED } });
            expect(UserModel.findOne).toBeCalled();
            expect(UserModel.findOne).toBeCalledWith({ email: MockValues.mEmail1, status: { $ne: Status.DELETED } });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorDataResult);
        });

    });

    describe('add', () => {

        test('User add', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(MockValues.mUsersEmpty as User[]);
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(MockValues.mUsersEmpty as User[]);
            jest.spyOn(UserModel, 'create').mockResolvedValueOnce(MockValues.mUser1 as never);
            jest.spyOn(EncryptionService, 'hash').mockResolvedValueOnce(MockValues.mUserToAdd.password);

            const result = await UserService.add(MockValues.mUserToAdd);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toHaveBeenNthCalledWith(1, { username: MockValues.mUsername1, status: { $ne: Status.DELETED } });
            expect(UserModel.find).toHaveBeenNthCalledWith(2, { email: MockValues.mEmail1 });
            expect(EncryptionService.hash).toBeCalled();
            expect(EncryptionService.hash).toBeCalledWith(MockValues.mUserToAdd.password);
            expect(UserModel.create).toBeCalled();
            expect(UserModel.create).toBeCalledWith(MockValues.mUserToAdd);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessDataResult);
        });

        test('User add with existing username', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(MockValues.mUsersFull as User[]);

            const result = await UserService.add(MockValues.mUserToAdd);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toBeCalledWith({ username: MockValues.mUsername1, status: { $ne: Status.DELETED } });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorDataResult);
        });

        test('User add with existing email', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(MockValues.mUsersEmpty as User[]);
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(MockValues.mUsersFull as User[]);

            const result = await UserService.add(MockValues.mUserToAdd);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toBeCalledWith({ username: MockValues.mUsername1, status: { $ne: Status.DELETED } });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorDataResult);
        });

    });

    describe('update', () => {

        test('User updating itself', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(MockValues.mUsersFull as User[]).mockResolvedValueOnce(MockValues.mUsersEmpty as User[]);
            jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValueOnce("");

            const result = await UserService.update(MockValues.mUserId1, MockValues.mUserToUpdate, MockValues.mTokenPayloadUser1);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toHaveBeenNthCalledWith(1, { _id: MockValues.mUserId1, status: { $ne: Status.DELETED } });
            expect(UserModel.find).toHaveBeenNthCalledWith(2, { _id: { $ne: MockValues.mUserId1 }, username: MockValues.mUserToUpdate.username, status: { $ne: Status.DELETED } });
            expect(UserModel.findOneAndUpdate).toBeCalled();
            expect(UserModel.findOneAndUpdate).toBeCalledWith({ _id: MockValues.mUserId1 }, MockValues.mUserToUpdate, { new: true });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessResult);
        });

        test('User updating itself with password', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(MockValues.mUsersFull as User[]).mockResolvedValueOnce(MockValues.mUsersEmpty as User[]);
            jest.spyOn(UserModel, 'findById').mockResolvedValueOnce(MockValues.mUser1 as User);
            jest.spyOn(EncryptionService, 'compare').mockResolvedValueOnce(false);
            jest.spyOn(EncryptionService, 'hash').mockResolvedValueOnce(MockValues.mPassword1);
            jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValueOnce("");

            const result = await UserService.update(MockValues.mUserId1, MockValues.mUserToUpdateWithPassword, MockValues.mTokenPayloadUser1);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toHaveBeenNthCalledWith(1, { _id: MockValues.mUserId1, status: { $ne: Status.DELETED } });
            expect(UserModel.find).toHaveBeenNthCalledWith(2, { _id: { $ne: MockValues.mUserId1 }, username: MockValues.mUserToUpdateWithPassword.username, status: { $ne: Status.DELETED } });

            expect(EncryptionService.compare).toBeCalled();
            expect(EncryptionService.compare).toBeCalledWith(MockValues.mUserToUpdateWithPassword.password, MockValues.mUser1.password);

            expect(EncryptionService.hash).toBeCalled();
            expect(EncryptionService.hash).toBeCalledWith(MockValues.mUserToUpdateWithPassword.password);

            expect(UserModel.findOneAndUpdate).toBeCalled();
            expect(UserModel.findOneAndUpdate).toBeCalledWith({ _id: MockValues.mUserId1 }, MockValues.mUserToUpdateWithPassword, { new: true });

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessResult);
        });

        test('Admin updating another user', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(MockValues.mUsersFull as User[]).mockResolvedValueOnce(MockValues.mUsersEmpty as User[]);
            jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValueOnce("");

            const result = await UserService.update(MockValues.mUserId2, MockValues.mUserToUpdate, MockValues.mTokenPayloadAdmin);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toHaveBeenNthCalledWith(1, { _id: MockValues.mUserId2, status: { $ne: Status.DELETED } });
            expect(UserModel.find).toHaveBeenNthCalledWith(2, { _id: { $ne: MockValues.mUserId2 }, username: MockValues.mUserToUpdate.username, status: { $ne: Status.DELETED } });
            expect(UserModel.findOneAndUpdate).toBeCalled();
            expect(UserModel.findOneAndUpdate).toBeCalledWith({ _id: MockValues.mUserId2 }, MockValues.mUserToUpdate, { new: true });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessResult);
        });

        test('User not exists', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(MockValues.mUsersEmpty as User[]);
            jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValueOnce("");

            const result = await UserService.update(MockValues.mUserId1, MockValues.mUserToUpdate, MockValues.mTokenPayloadUser1);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toHaveBeenNthCalledWith(1, { _id: MockValues.mUserId1, status: { $ne: Status.DELETED } });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

        test('User is not allowed to change this user', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(MockValues.mUsersFull as User[]);
            jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValueOnce("");

            const result = await UserService.update(MockValues.mUserId2, MockValues.mUserToUpdate, MockValues.mTokenPayloadUser1);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toHaveBeenNthCalledWith(1, { _id: MockValues.mUserId2, status: { $ne: Status.DELETED } });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

    });

    describe('changeRole', () => {

        test('Change role)', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(MockValues.mUsersFull as User[]);
            jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValueOnce("");

            const result = await UserService.changeRole(MockValues.mUserId1, Roles.ADMIN);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toHaveBeenNthCalledWith(1, { _id: MockValues.mUserId1, status: { $ne: Status.DELETED } });
            expect(UserModel.findOneAndUpdate).toBeCalled();
            expect(UserModel.findOneAndUpdate).toBeCalledWith({ _id: MockValues.mUserId1 }, { role: Roles.ADMIN }, { new: true });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessResult);
        });

        test('Change to an impossible role', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(MockValues.mUsersFull as User[]);
            jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValueOnce("");

            const result = await UserService.changeRole(MockValues.mUserId1, "AAA" as Roles);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toHaveBeenNthCalledWith(1, { _id: MockValues.mUserId1, status: { $ne: Status.DELETED } });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

    });

    describe('suspend', () => {

        test('Suspend user', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(MockValues.mUsersFull as User[]);
            jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValueOnce("");

            const result = await UserService.suspend(MockValues.mUserId1);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toHaveBeenNthCalledWith(1, { _id: MockValues.mUserId1, status: { $ne: Status.DELETED } });
            expect(UserModel.findOneAndUpdate).toBeCalled();
            expect(UserModel.findOneAndUpdate).toBeCalledWith({ _id: MockValues.mUserId1 }, { status: Status.SUSPENDED }, { new: true });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessResult);
        });

        test('Suspend non existing user', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(MockValues.mUsersEmpty as User[]);

            const result = await UserService.suspend(MockValues.mUserId1);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toHaveBeenNthCalledWith(1, { _id: MockValues.mUserId1, status: { $ne: Status.DELETED } });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

    });

    describe('activate', () => {

        test('Activate user', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(MockValues.mUsersFull as User[]);
            jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValueOnce("");

            const result = await UserService.activate(MockValues.mUserId1);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toHaveBeenNthCalledWith(1, { _id: MockValues.mUserId1, status: { $ne: Status.DELETED } });
            expect(UserModel.findOneAndUpdate).toBeCalled();
            expect(UserModel.findOneAndUpdate).toBeCalledWith({ _id: MockValues.mUserId1 }, { status: Status.ACTIVE }, { new: true });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessResult);
        });

        test('Activate non existing user', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(MockValues.mUsersEmpty as User[]);

            const result = await UserService.activate(MockValues.mUserId1);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toHaveBeenNthCalledWith(1, { _id: MockValues.mUserId1, status: { $ne: Status.DELETED } });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

    });

    describe('remove', () => {

        test('Delete user', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(MockValues.mUsersFull as User[]);
            jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValueOnce("");

            const result = await UserService.remove(MockValues.mUserId1);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toHaveBeenNthCalledWith(1, { _id: MockValues.mUserId1, status: { $ne: Status.DELETED } });
            expect(UserModel.findOneAndUpdate).toBeCalled();
            expect(UserModel.findOneAndUpdate).toBeCalledWith({ _id: MockValues.mUserId1 }, { status: Status.DELETED }, { new: true });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessResult);
        });

        test('Delete non existing user', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(MockValues.mUsersEmpty as User[]);

            const result = await UserService.remove(MockValues.mUserId1);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toHaveBeenNthCalledWith(1, { _id: MockValues.mUserId1, status: { $ne: Status.DELETED } });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

    });

    describe('purge', () => {

        test('User purging itself', async () => {
            jest.spyOn(PostModel, 'deleteMany').mockResolvedValueOnce("" as any);
            jest.spyOn(PostModel, 'updateMany').mockResolvedValueOnce("" as any);
            jest.spyOn(UserModel, 'findOneAndDelete').mockResolvedValueOnce("");

            const result = await UserService.purge(MockValues.mUserId1, MockValues.mTokenPayloadUser1);

            expect(PostModel.deleteMany).toBeCalled();
            expect(PostModel.deleteMany).toHaveBeenCalledWith({ owner: MockValues.mUserId1 });

            expect(PostModel.updateMany).toBeCalled();
            expect(PostModel.updateMany).toHaveBeenCalledWith({}, { $pull: { comments: { owner: MockValues.mUserId1 } } }, { timestamps: false });

            expect(UserModel.findOneAndDelete).toBeCalled();
            expect(UserModel.findOneAndDelete).toHaveBeenCalledWith({ _id: MockValues.mUserId1 });

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessResult);
        });

        test('Admin purging another user', async () => {
            jest.spyOn(PostModel, 'deleteMany').mockResolvedValueOnce("" as any);
            jest.spyOn(PostModel, 'updateMany').mockResolvedValueOnce("" as any);
            jest.spyOn(UserModel, 'findOneAndDelete').mockResolvedValueOnce("");

            const result = await UserService.purge(MockValues.mUserId2, MockValues.mTokenPayloadAdmin);

            expect(PostModel.deleteMany).toBeCalled();
            expect(PostModel.deleteMany).toHaveBeenCalledWith({ owner: MockValues.mUserId2 });

            expect(PostModel.updateMany).toBeCalled();
            expect(PostModel.updateMany).toHaveBeenCalledWith({}, { $pull: { comments: { owner: MockValues.mUserId2 } } }, { timestamps: false });

            expect(UserModel.findOneAndDelete).toBeCalled();
            expect(UserModel.findOneAndDelete).toHaveBeenCalledWith({ _id: MockValues.mUserId2 });

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessResult);
        });

        test('User trying to purge another user', async () => {
            const result = await UserService.purge(MockValues.mUserId2, MockValues.mTokenPayloadUser1);

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

        test('Purge fail', async () => {
            jest.spyOn(PostModel, 'deleteMany').mockImplementation(() => {
                throw new Error();
            });

            const result = await UserService.purge(MockValues.mUserId1, MockValues.mTokenPayloadUser1);

            expect(PostModel.deleteMany).toBeCalled();
            expect(PostModel.deleteMany).toHaveBeenCalledWith({ owner: MockValues.mUserId1 });

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

    });

});