import UserService from "../../../src/services/user.service"
import EncryptionService from "../../../src/core/services/encryption.service";
import Roles from "../../../src/core/types/enums/Roles";
import Status from "../../../src/types/enums/Status";
import { ErrorDataResult, SuccessDataResult } from "../../../src/core/results/DataResult";
import { User, UserAdd, UserSort, UserUpdate } from "../../../src/types/User";
import { ErrorResult, SuccessResult } from '../../../src/core/results/Result';
import { TokenPayload } from '../../../src/core/types/TokenPayload';
import { UserModel } from '../../../src/models/UserModel';
import { PostModel } from "../../../src/models/PostModel";


describe('User service', () => {

    describe('getAll', () => {
        const mDate = new Date();
        const mUsers: User[] = [
            {
                _id: "test_id_hash1",
                status: Status.ACTIVE,
                username: "test1",
                email: "test1@test1",
                password: "test_pass_hash1",
                role: Roles.ADMIN,
                dateCreated: mDate
            }
        ]

        const mUsersSorter: any = {
            sort: function () {
                return mUsers
            }
        }

        const mUserSort: UserSort = {
            username: 1
        }

        it('Should call UserModel find and return success result', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(mUsers as User[]);

            const result = await UserService.getAll();

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toBeCalledWith({ status: { $ne: Status.DELETED } });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessDataResult);
        });

        it('Should call UserModel find with UserSort parameters and return success result', async () => {
            jest.spyOn(UserModel, 'find').mockImplementationOnce((params: any) => {
                return mUsersSorter;
            });
            jest.spyOn(mUsersSorter, 'sort').mockResolvedValueOnce(mUsers as User[]);

            const result = await UserService.getAll(mUserSort);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toBeCalledWith({ status: { $ne: Status.DELETED } });
            expect(mUsersSorter.sort).toBeCalled();
            expect(mUsersSorter.sort).toBeCalledWith(mUserSort);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessDataResult);
        });

    });

    describe('getById', () => {
        const mId = "mock_value";
        const mDate = new Date();
        const mUser: User = {
            _id: "test_id_hash1",
            status: Status.ACTIVE,
            username: "test1",
            email: "test1@test1",
            password: "test_pass_hash1",
            role: Roles.ADMIN,
            dateCreated: mDate
        }

        const mUsers: User[] = [
            {
                _id: "test_id_hash1",
                status: Status.ACTIVE,
                username: "test1",
                email: "test1@test1",
                password: "test_pass_hash1",
                role: Roles.ADMIN,
                dateCreated: mDate
            }
        ]

        const mUsersEmpty: User[] = []

        it('Should call UserModel findById and return success result', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(mUsers as User[]);
            jest.spyOn(UserModel, 'findById').mockResolvedValueOnce(mUser as User);

            const result = await UserService.getById(mId);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toBeCalledWith({ _id: mId, status: { $ne: Status.DELETED } });
            expect(UserModel.findById).toBeCalled();
            expect(UserModel.findById).toBeCalledWith(mId);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessDataResult);
        });

        it('Should call UserModel findById and return error result', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(mUsersEmpty as User[]);
            jest.spyOn(UserModel, 'findById').mockResolvedValueOnce(mUser as User);

            const result = await UserService.getById(mId);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toBeCalledWith({ _id: mId, status: { $ne: Status.DELETED } });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorDataResult);
        });

    });

    describe('getByUsername', () => {
        const mUsername = "mock_value";
        const mDate = new Date();
        const mUser: User = {
            _id: "test_id_hash1",
            status: Status.ACTIVE,
            username: "test1",
            email: "test1@test1",
            password: "test_pass_hash1",
            role: Roles.ADMIN,
            dateCreated: mDate
        }

        const mUsers: User[] = [
            {
                _id: "test_id_hash1",
                status: Status.ACTIVE,
                username: "test1",
                email: "test1@test1",
                password: "test_pass_hash1",
                role: Roles.ADMIN,
                dateCreated: mDate
            }
        ]

        const mUsersEmpty: User[] = []

        it('Should call UserModel findOne and return success result', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(mUsers as User[]);
            jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(mUser as User);

            const result = await UserService.getByUsername(mUsername);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toBeCalledWith({ username: mUsername, status: { $ne: Status.DELETED } });
            expect(UserModel.findOne).toBeCalled();
            expect(UserModel.findOne).toBeCalledWith({ username: mUsername, status: { $ne: Status.DELETED } });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessDataResult);
        });

        it('Should call UserModel findOne and return error result', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(mUsersEmpty as User[]);
            jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(mUser as User);

            const result = await UserService.getByUsername(mUsername);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toBeCalledWith({ username: mUsername, status: { $ne: Status.DELETED } });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorDataResult);
        });

    });

    describe('getByEmail', () => {
        const mEmail = "mock_value";
        const mDate = new Date();
        const mUser: User = {
            _id: "test_id_hash1",
            status: Status.ACTIVE,
            username: "test1",
            email: "test1@test1",
            password: "test_pass_hash1",
            role: Roles.ADMIN,
            dateCreated: mDate
        }

        const mUsers: User[] = [
            {
                _id: "test_id_hash1",
                status: Status.ACTIVE,
                username: "test1",
                email: "test1@test1",
                password: "test_pass_hash1",
                role: Roles.ADMIN,
                dateCreated: mDate
            }
        ]

        const mUsersEmpty: User[] = []

        it('Should call UserModel findOne and return success result', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(mUsers as User[]);
            jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(mUser as User);

            const result = await UserService.getByEmail(mEmail);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toBeCalledWith({ email: mEmail, status: { $ne: Status.DELETED } });
            expect(UserModel.findOne).toBeCalled();
            expect(UserModel.findOne).toBeCalledWith({ email: mEmail, status: { $ne: Status.DELETED } });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessDataResult);
        });

        it('Should call UserModel findOne and return error result', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(mUsersEmpty as User[]);
            jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(mUser as User);

            const result = await UserService.getByEmail(mEmail);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toBeCalledWith({ email: mEmail, status: { $ne: Status.DELETED } });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorDataResult);
        });

    });

    describe('add', () => {
        const mEmail = "mock_value";
        const mUsername = "mock_value";
        const mDate = new Date();

        const mUser: User = {
            _id: "test_id_hash1",
            status: Status.ACTIVE,
            username: "test1",
            email: "test1@test1",
            password: "test_pass_hash1",
            role: Roles.ADMIN,
            dateCreated: mDate
        }

        const mUsers: User[] = [
            {
                _id: "test_id_hash1",
                status: Status.ACTIVE,
                username: "test1",
                email: "test1@test1",
                password: "test_pass_hash1",
                role: Roles.ADMIN,
                dateCreated: mDate
            }
        ]

        const mUserToAdd: UserAdd = {
            username: "mock_value",
            email: "mock_value",
            password: "mock_value"
        }

        const mUsersEmpty: User[] = []

        it('Should call UserModel create and return success result', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValue(mUsersEmpty as User[]);
            jest.spyOn(UserModel, 'create').mockResolvedValueOnce(mUser as never);
            jest.spyOn(EncryptionService, 'hash').mockResolvedValueOnce(mUserToAdd.password);

            const result = await UserService.add(mUserToAdd);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toHaveBeenNthCalledWith(1, { username: mUsername, status: { $ne: Status.DELETED } });
            expect(UserModel.find).toHaveBeenNthCalledWith(2, { email: mEmail });
            expect(EncryptionService.hash).toBeCalled();
            expect(EncryptionService.hash).toBeCalledWith(mUserToAdd.password);
            expect(UserModel.create).toBeCalled();
            expect(UserModel.create).toBeCalledWith(mUserToAdd);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessDataResult);
        });

        it('Should call UserModel create and return error result', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValue(mUsers as User[]);
            jest.spyOn(UserModel, 'create').mockResolvedValueOnce(mUser as never);

            const result = await UserService.add(mUserToAdd);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toBeCalledWith({ username: mUsername, status: { $ne: Status.DELETED } });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorDataResult);
        });

    });

    describe('update', () => {
        const mIdUserItself = "1";
        const mIdAnotherUser = "2";
        const mDate = new Date();

        const mUser: User = {
            _id: "test_id_hash1",
            status: Status.ACTIVE,
            username: "test1",
            email: "test1@test1",
            password: "test_pass_hash1",
            role: Roles.ADMIN,
            dateCreated: mDate
        }

        const mUsers: User[] = [
            {
                _id: "test_id_hash1",
                status: Status.ACTIVE,
                username: "test1",
                email: "test1@test1",
                password: "test_pass_hash1",
                role: Roles.ADMIN,
                dateCreated: mDate
            }
        ]

        const mTokenPayload: TokenPayload = {
            id: "1",
            status: Status.ACTIVE,
            username: "mock_data",
            email: "mock_data",
            role: Roles.USER,
        }

        const mTokenPayloadAdmin: TokenPayload = {
            id: "1",
            status: Status.ACTIVE,
            username: "mock_data",
            email: "mock_data",
            role: Roles.ADMIN,
        }

        const mUserToUpdate: UserUpdate = {
            username: "mock_value"
        }

        const mUserToUpdateWithPassword: UserUpdate = {
            username: "mock_value",
            password: "password"
        }

        const mUsersEmpty: User[] = []

        it('Should call UserModel findOneAndUpdate and return success result (user updating itself)', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(mUsers as User[]).mockResolvedValueOnce(mUsersEmpty as User[]);
            jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValueOnce("");

            const result = await UserService.update(mIdUserItself, mUserToUpdate, mTokenPayload);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toHaveBeenNthCalledWith(1, { _id: mIdUserItself, status: { $ne: Status.DELETED } });
            expect(UserModel.find).toHaveBeenNthCalledWith(2, { _id: { $ne: mIdUserItself }, username: mUserToUpdate.username, status: { $ne: Status.DELETED } });
            expect(UserModel.findOneAndUpdate).toBeCalled();
            expect(UserModel.findOneAndUpdate).toBeCalledWith({ _id: mIdUserItself }, mUserToUpdate, { new: true });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessResult);
        });

        it('Should call UserModel findOneAndUpdate and return success result (user updating itself with password)', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(mUsers as User[]).mockResolvedValueOnce(mUsersEmpty as User[]);
            jest.spyOn(UserModel, 'findById').mockResolvedValueOnce(mUser as User);
            jest.spyOn(EncryptionService, 'compare').mockResolvedValueOnce(false);
            jest.spyOn(EncryptionService, 'hash').mockResolvedValueOnce("password");
            jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValueOnce("");


            const result = await UserService.update(mIdUserItself, mUserToUpdateWithPassword, mTokenPayload);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toHaveBeenNthCalledWith(1, { _id: mIdUserItself, status: { $ne: Status.DELETED } });
            expect(UserModel.find).toHaveBeenNthCalledWith(2, { _id: { $ne: mIdUserItself }, username: mUserToUpdateWithPassword.username, status: { $ne: Status.DELETED } });

            expect(EncryptionService.compare).toBeCalled();
            expect(EncryptionService.compare).toBeCalledWith(mUserToUpdateWithPassword.password, mUser.password);

            expect(EncryptionService.hash).toBeCalled();
            expect(EncryptionService.hash).toBeCalledWith(mUserToUpdateWithPassword.password);

            expect(UserModel.findOneAndUpdate).toBeCalled();
            expect(UserModel.findOneAndUpdate).toBeCalledWith({ _id: mIdUserItself }, mUserToUpdateWithPassword, { new: true });

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessResult);
        });

        it('Should call UserModel findOneAndUpdate and return success result (admin updating another user)', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(mUsers as User[]).mockResolvedValueOnce(mUsersEmpty as User[]);
            jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValueOnce("");

            const result = await UserService.update(mIdAnotherUser, mUserToUpdate, mTokenPayloadAdmin);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toHaveBeenNthCalledWith(1, { _id: mIdAnotherUser, status: { $ne: Status.DELETED } });
            expect(UserModel.find).toHaveBeenNthCalledWith(2, { _id: { $ne: mIdAnotherUser }, username: mUserToUpdate.username, status: { $ne: Status.DELETED } });
            expect(UserModel.findOneAndUpdate).toBeCalled();
            expect(UserModel.findOneAndUpdate).toBeCalledWith({ _id: mIdAnotherUser }, mUserToUpdate, { new: true });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessResult);
        });

        it('Should call UserModel findOneAndUpdate and return error result (user not exists)', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(mUsersEmpty as User[]);
            jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValueOnce("");

            const result = await UserService.update(mIdUserItself, mUserToUpdate, mTokenPayload);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toHaveBeenNthCalledWith(1, { _id: mIdUserItself, status: { $ne: Status.DELETED } });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

        it('Should call UserModel findOneAndUpdate and return error result (user is not allowed to change this user)', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(mUsers as User[]);
            jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValueOnce("");

            const result = await UserService.update(mIdAnotherUser, mUserToUpdate, mTokenPayload);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toHaveBeenNthCalledWith(1, { _id: mIdAnotherUser, status: { $ne: Status.DELETED } });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

    });

    describe('changeRole', () => {
        const mIdUserItself = "1";
        const mDate = new Date();

        const mUsers: User[] = [
            {
                _id: "test_id_hash1",
                status: Status.ACTIVE,
                username: "test1",
                email: "test1@test1",
                password: "test_pass_hash1",
                role: Roles.ADMIN,
                dateCreated: mDate
            }
        ]

        it('Should call UserModel findOneAndUpdate and return success result (possible role)', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(mUsers as User[]);
            jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValueOnce("");

            const result = await UserService.changeRole(mIdUserItself, Roles.ADMIN);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toHaveBeenNthCalledWith(1, { _id: mIdUserItself, status: { $ne: Status.DELETED } });
            expect(UserModel.findOneAndUpdate).toBeCalled();
            expect(UserModel.findOneAndUpdate).toBeCalledWith({ _id: mIdUserItself }, { role: Roles.ADMIN }, { new: true });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessResult);
        });

        it('Should call UserModel findOneAndUpdate and return error result (impossible role)', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(mUsers as User[]);
            jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValueOnce("");

            const result = await UserService.changeRole(mIdUserItself, "AAA" as Roles);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toHaveBeenNthCalledWith(1, { _id: mIdUserItself, status: { $ne: Status.DELETED } });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

    });

    describe('suspend', () => {
        const mIdUserItself = "1";
        const mDate = new Date();

        const mUsers: User[] = [
            {
                _id: "test_id_hash1",
                status: Status.ACTIVE,
                username: "test1",
                email: "test1@test1",
                password: "test_pass_hash1",
                role: Roles.ADMIN,
                dateCreated: mDate
            }
        ]

        it('Should call UserModel findOneAndUpdate and return success result', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(mUsers as User[]);
            jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValueOnce("");

            const result = await UserService.suspend(mIdUserItself);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toHaveBeenNthCalledWith(1, { _id: mIdUserItself, status: { $ne: Status.DELETED } });
            expect(UserModel.findOneAndUpdate).toBeCalled();
            expect(UserModel.findOneAndUpdate).toBeCalledWith({ _id: mIdUserItself }, { status: Status.SUSPENDED }, { new: true });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessResult);
        });

    });

    describe('activate', () => {
        const mIdUserItself = "1";
        const mDate = new Date();

        const mUsers: User[] = [
            {
                _id: "test_id_hash1",
                status: Status.ACTIVE,
                username: "test1",
                email: "test1@test1",
                password: "test_pass_hash1",
                role: Roles.ADMIN,
                dateCreated: mDate
            }
        ]

        it('Should call UserModel findOneAndUpdate and return success result', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(mUsers as User[]);
            jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValueOnce("");

            const result = await UserService.activate(mIdUserItself);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toHaveBeenNthCalledWith(1, { _id: mIdUserItself, status: { $ne: Status.DELETED } });
            expect(UserModel.findOneAndUpdate).toBeCalled();
            expect(UserModel.findOneAndUpdate).toBeCalledWith({ _id: mIdUserItself }, { status: Status.ACTIVE }, { new: true });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessResult);
        });

    });

    describe('remove', () => {
        const mIdUserItself = "1";
        const mDate = new Date();

        const mUsers: User[] = [
            {
                _id: "test_id_hash1",
                status: Status.ACTIVE,
                username: "test1",
                email: "test1@test1",
                password: "test_pass_hash1",
                role: Roles.ADMIN,
                dateCreated: mDate
            }
        ]

        it('Should call UserModel findOneAndUpdate and return success result', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValueOnce(mUsers as User[]);
            jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValueOnce("");

            const result = await UserService.remove(mIdUserItself);

            expect(UserModel.find).toBeCalled();
            expect(UserModel.find).toHaveBeenNthCalledWith(1, { _id: mIdUserItself, status: { $ne: Status.DELETED } });
            expect(UserModel.findOneAndUpdate).toBeCalled();
            expect(UserModel.findOneAndUpdate).toBeCalledWith({ _id: mIdUserItself }, { status: Status.DELETED }, { new: true });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessResult);
        });

    });


    describe('purge', () => {
        const mIdUserItself = "1";
        const mIdAnotherUser = "2";
        const mDate = new Date();

        const mTokenPayload: TokenPayload = {
            id: "1",
            status: Status.ACTIVE,
            username: "mock_data",
            email: "mock_data",
            role: Roles.USER,
        }

        const mTokenPayloadAdmin: TokenPayload = {
            id: "1",
            status: Status.ACTIVE,
            username: "mock_data",
            email: "mock_data",
            role: Roles.ADMIN,
        }

        it('Should call UserModel findOneAndUpdate and return success result (user purging itself)', async () => {
            jest.spyOn(PostModel, 'deleteMany').mockResolvedValueOnce("" as any);
            jest.spyOn(PostModel, 'updateMany').mockResolvedValueOnce("" as any);
            jest.spyOn(UserModel, 'findOneAndDelete').mockResolvedValueOnce("");

            const result = await UserService.purge(mIdUserItself, mTokenPayload);

            expect(PostModel.deleteMany).toBeCalled();
            expect(PostModel.deleteMany).toHaveBeenCalledWith({ owner: mIdUserItself });

            expect(PostModel.updateMany).toBeCalled();
            expect(PostModel.updateMany).toHaveBeenCalledWith({}, { $pull: { comments: { owner: mIdUserItself } } });

            expect(UserModel.findOneAndDelete).toBeCalled();
            expect(UserModel.findOneAndDelete).toHaveBeenCalledWith({ _id: mIdUserItself });
   
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessResult);
        });

        it('Should call UserModel findOneAndUpdate and return success result (admin purging another user)', async () => {
            jest.spyOn(PostModel, 'deleteMany').mockResolvedValueOnce("" as any);
            jest.spyOn(PostModel, 'updateMany').mockResolvedValueOnce("" as any);
            jest.spyOn(UserModel, 'findOneAndDelete').mockResolvedValueOnce("");

            const result = await UserService.purge(mIdAnotherUser, mTokenPayloadAdmin);

            expect(PostModel.deleteMany).toBeCalled();
            expect(PostModel.deleteMany).toHaveBeenCalledWith({ owner: mIdAnotherUser });

            expect(PostModel.updateMany).toBeCalled();
            expect(PostModel.updateMany).toHaveBeenCalledWith({}, { $pull: { comments: { owner: mIdAnotherUser } } });

            expect(UserModel.findOneAndDelete).toBeCalled();
            expect(UserModel.findOneAndDelete).toHaveBeenCalledWith({ _id: mIdAnotherUser });
   
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessResult);
        });

        it('Should call UserModel findOneAndUpdate and return success result (user is not allowed to purge this user)', async () => {
            jest.spyOn(PostModel, 'deleteMany').mockResolvedValueOnce("" as any);
            jest.spyOn(PostModel, 'updateMany').mockResolvedValueOnce("" as any);
            jest.spyOn(UserModel, 'findOneAndDelete').mockResolvedValueOnce("");

            const result = await UserService.purge(mIdAnotherUser, mTokenPayload);

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

    });

});