import { SuccessDataResult } from "../../../src/core/results/DataResult";
import { ErrorResult, SuccessResult } from '../../../src/core/results/Result';
import { PostModel } from "../../../src/models/PostModel";
import PostService from "../../../src/services/post.service";
import { Post, PostAdd } from "../../../src/types/Post";
import Visibility from "../../../src/types/enums/Visibility";
import { CommentAdd } from "../../../src/types/Comment";
import { MockValues } from "../mocks/const-mock-values";


describe('Post service', () => {


    describe('getAll', () => {

        it('Should call PostModel find and return success result', async () => {
            jest.spyOn(PostModel, 'find').mockResolvedValueOnce(MockValues.mPostsFull as Post[]);

            const result = await PostService.getAll();

            expect(PostModel.find).toBeCalled();
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessDataResult);
        });

        it('Should call PostModel find with PostSort parameters and return success result', async () => {
            jest.spyOn(PostModel, 'find').mockImplementationOnce((params: any) => {
                return MockValues.mPostSorter;
            });
            jest.spyOn(MockValues.mPostSorter, 'sort').mockResolvedValueOnce(MockValues.mPostsFull as Post[]);

            const result = await PostService.getAll(MockValues.mPostSort);

            expect(PostModel.find).toBeCalled();
            expect(MockValues.mPostSorter.sort).toBeCalled();
            expect(MockValues.mPostSorter.sort).toBeCalledWith(MockValues.mPostSort);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessDataResult);
        });

    });

    describe('getByVisibility', () => {

        it('Should call PostModel find and return success result', async () => {
            jest.spyOn(PostModel, 'find').mockResolvedValueOnce(MockValues.mPostsFull as Post[]);

            const result = await PostService.getByVisibility(Visibility.PUBLIC);

            expect(PostModel.find).toBeCalled();
            expect(PostModel.find).toBeCalledWith({ visibility: { $eq: Visibility.PUBLIC } });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessDataResult);
        });

        it('Should call PostModel find with PostSort parameters and return success result', async () => {
            jest.spyOn(PostModel, 'find').mockImplementationOnce((params: any) => {
                return MockValues.mPostSorter;
            });
            jest.spyOn(MockValues.mPostSorter, 'sort').mockResolvedValueOnce(MockValues.mPostsFull as Post[]);

            const result = await PostService.getByVisibility(Visibility.PUBLIC, MockValues.mPostSort);

            expect(PostModel.find).toBeCalled();
            expect(PostModel.find).toBeCalledWith({ visibility: { $eq: Visibility.PUBLIC } });
            expect(MockValues.mPostSorter.sort).toBeCalled();
            expect(MockValues.mPostSorter.sort).toBeCalledWith(MockValues.mPostSort);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessDataResult);
        });

    });

    describe('getByUserId', () => {

        it('Should call PostModel find and return success result', async () => {
            jest.spyOn(PostModel, 'find').mockResolvedValueOnce(MockValues.mPostsFull as Post[]);

            const result = await PostService.getByUserId(MockValues.mUserId1);

            expect(PostModel.find).toBeCalled();
            expect(PostModel.find).toBeCalledWith({ owner: { $eq: MockValues.mUserId1 } });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessDataResult);
        });

        it('Should call PostModel find with PostSort parameters and return success result', async () => {
            jest.spyOn(PostModel, 'find').mockImplementationOnce((params: any) => {
                return MockValues.mPostSorter;
            });
            jest.spyOn(MockValues.mPostSorter, 'sort').mockResolvedValueOnce(MockValues.mPostsFull as Post[]);

            const result = await PostService.getByUserId(MockValues.mUserId1, MockValues.mPostSort);

            expect(PostModel.find).toBeCalled();
            expect(PostModel.find).toBeCalledWith({ owner: { $eq: MockValues.mUserId1 } });
            expect(MockValues.mPostSorter.sort).toBeCalled();
            expect(MockValues.mPostSorter.sort).toBeCalledWith(MockValues.mPostSort);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessDataResult);
        });

    });

    describe('add', () => {

        const postToAddResult: PostAdd = {
            owner: MockValues.mTokenPayloadUser1.id,
            header: "mock_data",
            body: "mock_data",
            visibility: Visibility.PUBLIC
        }

        it('Should call PostModel create and return success result', async () => {
            jest.spyOn(PostModel, 'create').mockResolvedValueOnce("" as never);

            const result = await PostService.add(MockValues.postToAdd, MockValues.mTokenPayloadUser1);

            expect(PostModel.create).toBeCalled();
            expect(PostModel.create).toBeCalledWith(postToAddResult);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessResult);
        });

    });

    describe('update', () => {

        it('Should call PostModel findOneAndUpdate and return success result (User updating its own post)', async () => {
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

        it('Should call PostModel findOneAndUpdate and return success result (Admin updating another users post)', async () => {
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

        it('Should call PostModel findOneAndUpdate and return error result (User trying to update not existing post)', async () => {
            jest.spyOn(PostModel, 'find').mockResolvedValueOnce(MockValues.mPostsEmpty as Post[]);

            const result = await PostService.update(MockValues.mPostId1, MockValues.mPostToUpdate, MockValues.mTokenPayloadUser1);

            expect(PostModel.find).toBeCalled();
            expect(PostModel.find).toBeCalledWith({ _id: MockValues.mPostId1 });

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

        it('Should return error result (User trying to update another users post)', async () => {
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

        const mCommentAddResult: CommentAdd = {
            owner: MockValues.mTokenPayloadUser1.id,
            comment: "mock_data"
        }

        it('Should call PostModel findOneAndUpdate and return success result', async () => {
            jest.spyOn(PostModel, 'find').mockResolvedValueOnce(MockValues.mPostsFull as Post[]);
            jest.spyOn(PostModel, 'findOneAndUpdate').mockResolvedValueOnce("" as never);

            const result = await PostService.addComment(MockValues.mPostId1, MockValues.mCommentAdd, MockValues.mTokenPayloadUser1);

            expect(PostModel.find).toBeCalled();
            expect(PostModel.find).toBeCalledWith({ _id: MockValues.mPostId1 });

            expect(PostModel.findOneAndUpdate).toBeCalled();
            expect(PostModel.findOneAndUpdate).toBeCalledWith({ _id: MockValues.mPostId1 }, { $push: { comments: mCommentAddResult } }, { new: true });
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessResult);
        });

        it('Should call PostModel findOneAndUpdate and return success result (User trying to add comment to a non existing post)', async () => {
            jest.spyOn(PostModel, 'find').mockResolvedValueOnce(MockValues.mPostsEmpty as Post[]);

            const result = await PostService.addComment(MockValues.mPostId1, MockValues.mCommentAdd, MockValues.mTokenPayloadUser1);

            expect(PostModel.find).toBeCalled();
            expect(PostModel.find).toBeCalledWith({ _id: MockValues.mPostId1 });

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

    });

    describe('removeComment', () => {

        it('Should call PostModel findOneAndUpdate and return success result (User deleting its own comment from another users post)', async () => {
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

        it('Should call PostModel findOneAndUpdate and return success result (Admin deleting another users comment from another users post)', async () => {
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

        it('Should call PostModel findOneAndUpdate and return success result (User trying to delete non existing comment from a post or a non existing post)', async () => {
            jest.spyOn(PostModel, 'find').mockResolvedValueOnce(MockValues.mPostsEmpty as Post[]);

            const result = await PostService.removeComment(MockValues.mPostId2, MockValues.mCommentId1, MockValues.mTokenPayloadUser1);

            expect(PostModel.find).toBeCalled();
            expect(PostModel.find).toBeCalledWith({ _id: MockValues.mPostId2 });

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

        it('Should call PostModel findOneAndUpdate and return success result (User trying to delete another users comment from another users post)', async () => {
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

    describe('update', () => {

        it('Should call PostModel findOneAndDelete and return success result (User deleting its own post)', async () => {
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

        it('Should call PostModel findOneAndDelete and return success result (Admin deleting another users post)', async () => {
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

        it('Should call PostModel findOneAndDelete and return error result (User trying to delete not existing post)', async () => {
            jest.spyOn(PostModel, 'find').mockResolvedValueOnce(MockValues.mPostsEmpty as Post[]);

            const result = await PostService.remove(MockValues.mPostId1, MockValues.mTokenPayloadUser1);

            expect(PostModel.find).toBeCalled();
            expect(PostModel.find).toBeCalledWith({ _id: MockValues.mPostId1 });

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

        it('Should return error result (User trying to delete another users post)', async () => {
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