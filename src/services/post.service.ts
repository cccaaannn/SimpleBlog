import { PostModel } from "../models/PostModel"
import { Post, PostSort } from "../types/Post"
import { IResult, Result, SuccessResult, ErrorResult } from "../Results/Result"
import { IDataResult, DataResult, SuccessDataResult, ErrorDataResult } from "../Results/DataResult"
import Visibility from "../types/enums/Visibility";
import run from "../utils/business-runner";


async function getAll(postSort?: PostSort): Promise<DataResult<Post[]>> {
    if(postSort) {
        return new SuccessDataResult(await PostModel.find().sort(postSort));
    }
    return new SuccessDataResult(await PostModel.find());
}

async function getByVisibility(visibility: string, postSort?: PostSort): Promise<DataResult<Post[]>> {
    if(postSort) {
        return new SuccessDataResult(await PostModel.find({ visibility: { $eq: visibility } }).sort(postSort));
    }
    return new SuccessDataResult(await PostModel.find({ visibility: { $eq: visibility } }));
}

async function getByUserId(userId: number, postSort?: PostSort): Promise<DataResult<Post[]>> {
    if(postSort) {
        return new SuccessDataResult(await PostModel.find({ owner: { $eq: userId } }).sort(postSort));
    }
    return new SuccessDataResult(await PostModel.find({ owner: { $eq: userId } }));
}

async function add(post: Post): Promise<Result> {
    // const res: Result = await run(
    //     [
    //         { function: isUsernameUnique, args: [user.username] },
    //         { function: isEmailUnique, args: [user.email] },
    //         { function: isStatusPossible, args: [user.status] },
    //         { function: isRolePossible, args: [user.role] }
    //     ]
    // );
    // if(!res.status) {
    //     return res;
    // }

    await PostModel.create(post);
    return new SuccessResult("Created");
}

async function update(id: number, post: Post): Promise<Result> {
    const res: Result = await run(
        [
            { function: isExists, args: [id] },
            // { function: isUsernameUnique, args: [user.username, id] },
            // { function: isEmailNotChanged, args: [user.email, id] },
            // { function: isStatusPossible, args: [user.status] },
            // { function: isRolePossible, args: [user.role] }
        ]
    );
    if(!res.status) {
        return res;
    }

    await PostModel.findOneAndUpdate({ _id: id }, post, { new: true });
    return new SuccessResult("Post updated");
}

async function addComment(id: number, comment: Comment): Promise<Result> {
    const res: Result = await run(
        [
            { function: isExists, args: [id] },
            // { function: isUsernameUnique, args: [user.username, id] },
            // { function: isEmailNotChanged, args: [user.email, id] },
            // { function: isStatusPossible, args: [user.status] },
            // { function: isRolePossible, args: [user.role] }
        ]
    );
    if(!res.status) {
        return res;
    }

    await PostModel.findOneAndUpdate({ _id: id }, { $push: { comments: comment } }, { new: true });
    return new SuccessResult("Post updated");
}

async function removeComment(postId: number, commentId: number): Promise<Result> {
    const res: Result = await run(
        [
            { function: isExists, args: [postId] },
            // { function: isUsernameUnique, args: [user.username, id] },
            // { function: isEmailNotChanged, args: [user.email, id] },
            // { function: isStatusPossible, args: [user.status] },
            // { function: isRolePossible, args: [user.role] }
        ]
    );
    if(!res.status) {
        return res;
    }

    await PostModel.findOneAndUpdate({ _id: postId }, { $pull: { comments: { _id : commentId } } }, { new: true });
    return new SuccessResult("Post updated");
}

async function remove(id: number): Promise<Result> {
    const res: Result = await run(
        [
            { function: isExists, args: [id] }
        ]
    );
    if(!res.status) {
        return res;
    }

    await PostModel.findOneAndDelete({ _id: id });
    return new SuccessResult("Post deleted");
}


// ---------- ---------- business rules ---------- ----------

async function isExists(id: number): Promise<Result> {
    const post: any[] = await PostModel.find({ _id: id });
    if(post.length > 0) {
        return new SuccessResult();
    }
    return new ErrorResult("Post not exits");
}

// ---------- ---------- ---------- ---------- ----------





export const PostService = {
    getAll,
    getByVisibility,
    getByUserId,
    add,
    update,
    addComment,
    removeComment,
    remove
};
