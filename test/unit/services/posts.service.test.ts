import PostService from "../../../src/services/post.service";
import Visibility from "../../../src/types/enums/Visibility";

import { ErrorResult, SuccessResult } from '../../../src/core/results/Result';
import { ErrorDataResult, SuccessDataResult } from "../../../src/core/results/DataResult";
import { MockValues } from "../../utils/mocks/const-mock-values";
import { PostModel } from "../../../src/models/PostModel";
import { Post } from "../../../src/types/Post";
import Category from "../../../src/types/enums/Category";


describe('Post service', () => {

    describe('getAll', () => {

        test('Get all posts without any parameters', async () => {
            jest.spyOn(PostModel, 'find').mockImplementationOnce((params: any) => {
                return MockValues.mPostPopulaterAfterSorter as any
            });
            jest.spyOn(MockValues.mPostPopulaterAfterSorter, 'populate');
            jest.spyOn(MockValues.mPostSorter, 'sort');

            const result = await PostService.getAll(null, null, null);

            let categoryFilter: Category[] = Object.values(Category);

            expect(PostModel.find).toBeCalled();
            expect(PostModel.find).toBeCalledWith({ visibility: { $in: [Visibility.PUBLIC] }, category: { $in: categoryFilter } });
            expect(MockValues.mPostPopulaterAfterSorter.populate).toBeCalled();
            expect(MockValues.mPostPopulaterAfterSorter.populate).toBeCalledWith("owner", "_id username");
            expect(MockValues.mPostSorter.sort).toBeCalled();
            expect(MockValues.mPostSorter.sort).toBeCalledWith(undefined);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessDataResult);
        });

        test('Get all posts with all parameters', async () => {
            jest.spyOn(PostModel, 'find').mockImplementationOnce((params: any) => {
                return MockValues.mPostPopulaterAfterSorter as any
            });
            jest.spyOn(MockValues.mPostPopulaterAfterSorter, 'populate');
            jest.spyOn(MockValues.mPostSorter, 'sort');

            const result = await PostService.getAll(MockValues.mTokenPayloadResetUser1, Category.GENERAL, MockValues.mPostSort);

            let categoryFilter: Category[] = [Category.GENERAL]

            expect(PostModel.find).toBeCalled();
            expect(PostModel.find).toBeCalledWith({ visibility: { $in: [Visibility.PUBLIC, Visibility.MEMBERS] }, category: { $in: categoryFilter } });
            expect(MockValues.mPostPopulaterAfterSorter.populate).toBeCalled();
            expect(MockValues.mPostPopulaterAfterSorter.populate).toBeCalledWith("owner", "_id username");
            expect(MockValues.mPostSorter.sort).toBeCalled();
            expect(MockValues.mPostSorter.sort).toBeCalledWith(MockValues.mPostSort);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessDataResult);
        });

    });

    describe('getByUserId', () => {

        test("Get posts by user's by id without any parameters", async () => {
            jest.spyOn(PostModel, 'find').mockImplementationOnce((params: any) => {
                return MockValues.mPostPopulaterAfterSorter as any
            });
            jest.spyOn(MockValues.mPostPopulaterAfterSorter, 'populate');
            jest.spyOn(MockValues.mPostSorter, 'sort');

            const result = await PostService.getByUserId(MockValues.mUserId1, null, null, null);

            let categoryFilter: Category[] = Object.values(Category);

            expect(PostModel.find).toBeCalled();
            expect(PostModel.find).toBeCalledWith({ owner: { $eq: MockValues.mUserId1 }, visibility: { $in: [Visibility.PUBLIC] }, category: { $in: categoryFilter } });
            expect(MockValues.mPostPopulaterAfterSorter.populate).toBeCalled();
            expect(MockValues.mPostPopulaterAfterSorter.populate).toBeCalledWith("owner", "_id username");
            expect(MockValues.mPostSorter.sort).toBeCalled();
            expect(MockValues.mPostSorter.sort).toBeCalledWith(undefined);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessDataResult);
        });

        test("Get posts by user's by id with all parameters", async () => {
            jest.spyOn(PostModel, 'find').mockImplementationOnce((params: any) => {
                return MockValues.mPostPopulaterAfterSorter as any
            });
            jest.spyOn(MockValues.mPostPopulaterAfterSorter, 'populate');
            jest.spyOn(MockValues.mPostSorter, 'sort');

            const result = await PostService.getByUserId(MockValues.mUserId1, MockValues.mTokenPayloadResetUser1, Category.GENERAL, MockValues.mPostSort);

            let categoryFilter: Category[] = [Category.GENERAL]

            expect(PostModel.find).toBeCalled();
            expect(PostModel.find).toBeCalledWith({ owner: { $eq: MockValues.mUserId1 }, visibility: { $in: [Visibility.PUBLIC, Visibility.MEMBERS, Visibility.PRIVATE] }, category: { $in: categoryFilter } });
            expect(MockValues.mPostPopulaterAfterSorter.populate).toBeCalled();
            expect(MockValues.mPostPopulaterAfterSorter.populate).toBeCalledWith("owner", "_id username");
            expect(MockValues.mPostSorter.sort).toBeCalled();
            expect(MockValues.mPostSorter.sort).toBeCalledWith(MockValues.mPostSort);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessDataResult);
        });

    });

    describe('getById', () => {

        test("Not existing post", async () => {
            jest.spyOn(PostModel, 'find').mockResolvedValueOnce(MockValues.mPostsEmpty);

            const result = await PostService.getById(MockValues.mPostId1, undefined);

            expect(PostModel.find).toBeCalled();
            expect(PostModel.find).toBeCalledWith({ _id: MockValues.mPostId1 });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorDataResult);
        });

        test("Non member requesting public post", async () => {
            jest.spyOn(PostModel, 'find').mockResolvedValueOnce(MockValues.mPostsFull);
            jest.spyOn(PostModel, 'findById').mockImplementationOnce((params: any) => {
                return MockValues.mPostPopulater as any
            });
            jest.spyOn(MockValues.mPostPopulater, 'populate');

            const result = await PostService.getById(MockValues.mPostId1, undefined);

            expect(PostModel.find).toBeCalled();
            expect(PostModel.find).toBeCalledWith({ _id: MockValues.mPostId1 });
            expect(PostModel.findById).toBeCalled();
            expect(PostModel.findById).toBeCalledWith(MockValues.mPostId1);
            expect(MockValues.mPostPopulater.populate).toBeCalled();
            expect(MockValues.mPostPopulater.populate).toBeCalledWith("owner", "_id username");
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessDataResult);
        });

        test("Non member requesting member only post", async () => {
            jest.spyOn(PostModel, 'find').mockResolvedValueOnce(MockValues.mPostsFull);
            jest.spyOn(PostModel, 'findById').mockImplementationOnce((params: any) => {
                return MockValues.mPostPopulaterMember as any
            });
            jest.spyOn(MockValues.mPostPopulaterMember, 'populate');

            const result = await PostService.getById(MockValues.mPostId1, undefined);

            expect(PostModel.find).toBeCalled();
            expect(PostModel.find).toBeCalledWith({ _id: MockValues.mPostId1 });
            expect(PostModel.findById).toBeCalled();
            expect(PostModel.findById).toBeCalledWith(MockValues.mPostId1);
            expect(MockValues.mPostPopulaterMember.populate).toBeCalled();
            expect(MockValues.mPostPopulaterMember.populate).toBeCalledWith("owner", "_id username");
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorDataResult);
        });
    
        test("Member requesting member only post", async () => {
            jest.spyOn(PostModel, 'find').mockResolvedValueOnce(MockValues.mPostsFull);
            jest.spyOn(PostModel, 'findById').mockImplementationOnce((params: any) => {
                return MockValues.mPostPopulaterMember as any
            });
            jest.spyOn(MockValues.mPostPopulaterMember, 'populate');

            const result = await PostService.getById(MockValues.mPostId1, MockValues.mTokenPayloadUser1);

            expect(PostModel.find).toBeCalled();
            expect(PostModel.find).toBeCalledWith({ _id: MockValues.mPostId1 });
            expect(PostModel.findById).toBeCalled();
            expect(PostModel.findById).toBeCalledWith(MockValues.mPostId1);
            expect(MockValues.mPostPopulaterMember.populate).toBeCalled();
            expect(MockValues.mPostPopulaterMember.populate).toBeCalledWith("owner", "_id username");
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessDataResult);
        });

        test("Member requesting another users private post", async () => {
            jest.spyOn(PostModel, 'find').mockResolvedValueOnce(MockValues.mPostsFull);
            jest.spyOn(PostModel, 'findById').mockImplementationOnce((params: any) => {
                return MockValues.mPostPopulaterPrivate as any
            });
            jest.spyOn(MockValues.mPostPopulaterPrivate, 'populate');
            jest.spyOn(PostModel, 'findOne').mockResolvedValueOnce(null);

            const result = await PostService.getById(MockValues.mPostId1, MockValues.mTokenPayloadUser2);

            expect(PostModel.find).toBeCalled();
            expect(PostModel.find).toBeCalledWith({ _id: MockValues.mPostId1 });
            expect(PostModel.findById).toBeCalled();
            expect(PostModel.findById).toBeCalledWith(MockValues.mPostId1);
            expect(MockValues.mPostPopulaterPrivate.populate).toBeCalled();
            expect(MockValues.mPostPopulaterPrivate.populate).toBeCalledWith("owner", "_id username");
            expect(PostModel.findOne).toBeCalled();
            expect(PostModel.findOne).toBeCalledWith({ _id: MockValues.mPostId1, owner: { $eq: MockValues.mTokenPayloadUser2.id } });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorDataResult);
        });

        test("User requesting its own private post", async () => {
            jest.spyOn(PostModel, 'find').mockResolvedValueOnce(MockValues.mPostsFull);
            jest.spyOn(PostModel, 'findById').mockImplementationOnce((params: any) => {
                return MockValues.mPostPopulaterPrivate as any
            });
            jest.spyOn(MockValues.mPostPopulaterPrivate, 'populate');
            jest.spyOn(PostModel, 'findOne').mockResolvedValueOnce(MockValues.mPostPrivate);

            const result = await PostService.getById(MockValues.mPostId1, MockValues.mTokenPayloadUser1);

            expect(PostModel.find).toBeCalled();
            expect(PostModel.find).toBeCalledWith({ _id: MockValues.mPostId1 });
            expect(PostModel.findById).toBeCalled();
            expect(PostModel.findById).toBeCalledWith(MockValues.mPostId1);
            expect(MockValues.mPostPopulaterPrivate.populate).toBeCalled();
            expect(MockValues.mPostPopulaterPrivate.populate).toBeCalledWith("owner", "_id username");
            expect(PostModel.findOne).toBeCalled();
            expect(PostModel.findOne).toBeCalledWith({ _id: MockValues.mPostId1, owner: { $eq: MockValues.mTokenPayloadUser1.id } });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessDataResult);
        });

        test("Admin requesting another users private post", async () => {
            jest.spyOn(PostModel, 'find').mockResolvedValueOnce(MockValues.mPostsFull);
            jest.spyOn(PostModel, 'findById').mockImplementationOnce((params: any) => {
                return MockValues.mPostPopulaterPrivate as any
            });
            jest.spyOn(MockValues.mPostPopulaterPrivate, 'populate');

            const result = await PostService.getById(MockValues.mPostId1, MockValues.mTokenPayloadAdmin);

            expect(PostModel.find).toBeCalled();
            expect(PostModel.find).toBeCalledWith({ _id: MockValues.mPostId1 });
            expect(PostModel.findById).toBeCalled();
            expect(PostModel.findById).toBeCalledWith(MockValues.mPostId1);
            expect(MockValues.mPostPopulaterPrivate.populate).toBeCalled();
            expect(MockValues.mPostPopulaterPrivate.populate).toBeCalledWith("owner", "_id username");
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessDataResult);
        });

    });

    describe('add', () => {

        test('User adding a post', async () => {
            jest.spyOn(PostModel, 'create').mockResolvedValueOnce("" as never);

            const result = await PostService.add(MockValues.mPostToAdd, MockValues.mTokenPayloadUser1);

            expect(PostModel.create).toBeCalled();
            expect(PostModel.create).toBeCalledWith(MockValues.mPostToAdd);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessResult);
        });

        test('User adding a post with wrong validations', async () => {
            jest.spyOn(PostModel, 'create').mockResolvedValueOnce("" as never);

            const result = await PostService.add(MockValues.mPostToAddWrongValidations, MockValues.mTokenPayloadUser1);

            expect(PostModel.create).toBeCalled();
            expect(PostModel.create).toBeCalledWith(MockValues.mPostToAdd);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessResult);
        });

    });

    describe('update', () => {

        test('User updating its own post', async () => {
            jest.spyOn(PostModel, 'find').mockResolvedValueOnce(MockValues.mPostsFull as Post[]);
            jest.spyOn(PostModel, 'findOne').mockResolvedValueOnce(MockValues.mPost1 as Post);
            jest.spyOn(PostModel, 'findOneAndUpdate').mockResolvedValueOnce("" as never);

            const result = await PostService.update(MockValues.mPostId1, MockValues.mPostToUpdate, MockValues.mTokenPayloadUser1);

            expect(PostModel.find).toBeCalled();
            expect(PostModel.find).toBeCalledWith({ _id: MockValues.mPostId1 });

            expect(PostModel.findOne).toBeCalled();
            expect(PostModel.findOne).toBeCalledWith({ _id: MockValues.mPostId1, owner: { $eq: MockValues.mTokenPayloadUser1.id } });

            expect(PostModel.findOneAndUpdate).toBeCalled();
            expect(PostModel.findOneAndUpdate).toBeCalledWith({ _id: MockValues.mPostId1 }, MockValues.mPostToUpdate, { new: true });

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessResult);
        });

        test('Admin updating another users post', async () => {
            jest.spyOn(PostModel, 'find').mockResolvedValueOnce(MockValues.mPostsFull as Post[]);
            jest.spyOn(PostModel, 'findOneAndUpdate').mockResolvedValueOnce("" as never);

            const result = await PostService.update(MockValues.mPostId2, MockValues.mPostToUpdate, MockValues.mTokenPayloadAdmin);

            expect(PostModel.find).toBeCalled();
            expect(PostModel.find).toBeCalledWith({ _id: MockValues.mPostId2 });

            expect(PostModel.findOneAndUpdate).toBeCalled();
            expect(PostModel.findOneAndUpdate).toBeCalledWith({ _id: MockValues.mPostId2 }, MockValues.mPostToUpdate, { new: true });

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessResult);
        });

        test('User trying to update not existing post', async () => {
            jest.spyOn(PostModel, 'find').mockResolvedValueOnce(MockValues.mPostsEmpty as Post[]);

            const result = await PostService.update(MockValues.mPostId1, MockValues.mPostToUpdate, MockValues.mTokenPayloadUser1);

            expect(PostModel.find).toBeCalled();
            expect(PostModel.find).toBeCalledWith({ _id: MockValues.mPostId1 });

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

        test('User trying to update another users post', async () => {
            jest.spyOn(PostModel, 'find').mockResolvedValueOnce(MockValues.mPostsFull as Post[]);
            jest.spyOn(PostModel, 'findOne').mockResolvedValueOnce(null);

            const result = await PostService.update(MockValues.mPostId2, MockValues.mPostToUpdate, MockValues.mTokenPayloadUser1);

            expect(PostModel.find).toBeCalled();
            expect(PostModel.find).toBeCalledWith({ _id: MockValues.mPostId2 });

            expect(PostModel.findOne).toBeCalled();
            expect(PostModel.findOne).toBeCalledWith({ _id: MockValues.mPostId2, owner: { $eq: MockValues.mTokenPayloadUser1.id } });

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

    });

    describe('addComment', () => {

        test('User adding comment to a post', async () => {
            jest.spyOn(PostModel, 'find').mockResolvedValueOnce(MockValues.mPostsFull as Post[]);
            jest.spyOn(PostModel, 'findOneAndUpdate').mockResolvedValueOnce("" as never);

            const result = await PostService.addComment(MockValues.mPostId1, MockValues.mCommentAdd, MockValues.mTokenPayloadUser1);

            expect(PostModel.find).toBeCalled();
            expect(PostModel.find).toBeCalledWith({ _id: MockValues.mPostId1 });

            expect(PostModel.findOneAndUpdate).toBeCalled();
            expect(PostModel.findOneAndUpdate).toBeCalledWith({ _id: MockValues.mPostId1 }, { $push: { comments: MockValues.mCommentAdd } }, { new: true });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessResult);
        });

        test('User trying to add comment to a non existing post', async () => {
            jest.spyOn(PostModel, 'find').mockResolvedValueOnce(MockValues.mPostsEmpty as Post[]);

            const result = await PostService.addComment(MockValues.mPostId1, MockValues.mCommentAdd, MockValues.mTokenPayloadUser1);

            expect(PostModel.find).toBeCalled();
            expect(PostModel.find).toBeCalledWith({ _id: MockValues.mPostId1 });

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

    });

    describe('removeComment', () => {

        test('User deleting its own comment from another users post', async () => {
            jest.spyOn(PostModel, 'find').mockResolvedValueOnce(MockValues.mPostsFull as Post[]);
            jest.spyOn(PostModel, 'findOne').mockResolvedValueOnce(MockValues.mPost1 as Post);
            jest.spyOn(PostModel, 'findOneAndUpdate').mockResolvedValueOnce("" as never);

            const result = await PostService.removeComment(MockValues.mPostId2, MockValues.mCommentId1, MockValues.mTokenPayloadUser1);

            expect(PostModel.find).toBeCalled();
            expect(PostModel.find).toBeCalledWith({ _id: MockValues.mPostId2 });

            expect(PostModel.findOne).toBeCalled();
            expect(PostModel.findOne).toBeCalledWith({ _id: MockValues.mPostId2, comments: { _id: MockValues.mCommentId1, owner: MockValues.mTokenPayloadUser1.id } });

            expect(PostModel.findOneAndUpdate).toBeCalled();
            expect(PostModel.findOneAndUpdate).toBeCalledWith({ _id: MockValues.mPostId2 }, { $pull: { comments: { _id: MockValues.mCommentId1 } } }, { new: true });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessResult);
        });

        test('Admin deleting another users comment from another users post', async () => {
            jest.spyOn(PostModel, 'find').mockResolvedValueOnce(MockValues.mPostsFull as Post[]);
            jest.spyOn(PostModel, 'findOneAndUpdate').mockResolvedValueOnce("" as never);

            const result = await PostService.removeComment(MockValues.mPostId2, MockValues.mCommentId2, MockValues.mTokenPayloadAdmin);

            expect(PostModel.find).toBeCalled();
            expect(PostModel.find).toBeCalledWith({ _id: MockValues.mPostId2 });

            expect(PostModel.findOneAndUpdate).toBeCalled();
            expect(PostModel.findOneAndUpdate).toBeCalledWith({ _id: MockValues.mPostId2 }, { $pull: { comments: { _id: MockValues.mCommentId2 } } }, { new: true });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessResult);
        });

        test('User trying to delete non existing comment from a post or a non existing post', async () => {
            jest.spyOn(PostModel, 'find').mockResolvedValueOnce(MockValues.mPostsEmpty as Post[]);

            const result = await PostService.removeComment(MockValues.mPostId2, MockValues.mCommentId1, MockValues.mTokenPayloadUser1);

            expect(PostModel.find).toBeCalled();
            expect(PostModel.find).toBeCalledWith({ _id: MockValues.mPostId2 });

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

        test('User trying to delete another users comment from another users post', async () => {
            jest.spyOn(PostModel, 'find').mockResolvedValueOnce(MockValues.mPostsFull as Post[]);
            jest.spyOn(PostModel, 'findOne').mockResolvedValueOnce(null);

            const result = await PostService.removeComment(MockValues.mPostId2, MockValues.mCommentId2, MockValues.mTokenPayloadUser1);

            expect(PostModel.find).toBeCalled();
            expect(PostModel.find).toBeCalledWith({ _id: MockValues.mPostId2 });

            expect(PostModel.findOne).toBeCalled();
            expect(PostModel.findOne).toBeCalledWith({ _id: MockValues.mPostId2, comments: { _id: MockValues.mCommentId2, owner: MockValues.mTokenPayloadUser1.id } });

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

    });

    describe('remove', () => {

        test('User deleting its own post', async () => {
            jest.spyOn(PostModel, 'find').mockResolvedValueOnce(MockValues.mPostsFull as Post[]);
            jest.spyOn(PostModel, 'findOne').mockResolvedValueOnce(MockValues.mPost1 as Post);
            jest.spyOn(PostModel, 'findOneAndDelete').mockResolvedValueOnce("" as never);

            const result = await PostService.remove(MockValues.mPostId1, MockValues.mTokenPayloadUser1);

            expect(PostModel.find).toBeCalled();
            expect(PostModel.find).toBeCalledWith({ _id: MockValues.mPostId1 });

            expect(PostModel.findOne).toBeCalled();
            expect(PostModel.findOne).toBeCalledWith({ _id: MockValues.mPostId1, owner: { $eq: MockValues.mTokenPayloadUser1.id } });

            expect(PostModel.findOneAndDelete).toBeCalled();
            expect(PostModel.findOneAndDelete).toBeCalledWith({ _id: MockValues.mPostId1 });

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessResult);
        });

        test('Admin deleting another users post', async () => {
            jest.spyOn(PostModel, 'find').mockResolvedValueOnce(MockValues.mPostsFull as Post[]);
            jest.spyOn(PostModel, 'findOneAndDelete').mockResolvedValueOnce("" as never);

            const result = await PostService.remove(MockValues.mPostId2, MockValues.mTokenPayloadAdmin);

            expect(PostModel.find).toBeCalled();
            expect(PostModel.find).toBeCalledWith({ _id: MockValues.mPostId2 });

            expect(PostModel.findOneAndDelete).toBeCalled();
            expect(PostModel.findOneAndDelete).toBeCalledWith({ _id: MockValues.mPostId2 });

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessResult);
        });

        test('User trying to delete not existing post', async () => {
            jest.spyOn(PostModel, 'find').mockResolvedValueOnce(MockValues.mPostsEmpty as Post[]);

            const result = await PostService.remove(MockValues.mPostId1, MockValues.mTokenPayloadUser1);

            expect(PostModel.find).toBeCalled();
            expect(PostModel.find).toBeCalledWith({ _id: MockValues.mPostId1 });

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

        test('User trying to delete another users post', async () => {
            jest.spyOn(PostModel, 'find').mockResolvedValueOnce(MockValues.mPostsFull as Post[]);
            jest.spyOn(PostModel, 'findOne').mockResolvedValueOnce(null);

            const result = await PostService.remove(MockValues.mPostId2, MockValues.mTokenPayloadUser1);

            expect(PostModel.find).toBeCalled();
            expect(PostModel.find).toBeCalledWith({ _id: MockValues.mPostId2 });

            expect(PostModel.findOne).toBeCalled();
            expect(PostModel.findOne).toBeCalledWith({ _id: MockValues.mPostId2, owner: { $eq: MockValues.mTokenPayloadUser1.id } });

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

    });

});