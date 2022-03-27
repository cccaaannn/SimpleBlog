import { PostModel } from "../models/PostModel"
import { Post, PostSort } from "../types/Post"
import { IResult, Result, SuccessResult, ErrorResult } from "../core/results/Result"
import { IDataResult, DataResult, SuccessDataResult, ErrorDataResult } from "../core/results/DataResult"
import run from "../core/utils/business-runner";


async function getAll(postSort?: PostSort): Promise<IDataResult<Post[]>> {
    if (postSort) {
        return new SuccessDataResult(await PostModel.find().sort(postSort));
    }
    return new SuccessDataResult(await PostModel.find());
}

async function getByVisibility(visibility: string, postSort?: PostSort): Promise<IDataResult<Post[]>> {
    if (postSort) {
        return new SuccessDataResult(await PostModel.find({ visibility: { $eq: visibility } }).sort(postSort));
    }
    return new SuccessDataResult(await PostModel.find({ visibility: { $eq: visibility } }));
}

async function getByUserId(userId: number, postSort?: PostSort): Promise<IDataResult<Post[]>> {
    if (postSort) {
        return new SuccessDataResult(await PostModel.find({ owner: { $eq: userId } }).sort(postSort));
    }
    return new SuccessDataResult(await PostModel.find({ owner: { $eq: userId } }));
}

async function add(post: Post): Promise<IResult> {
    await PostModel.create(post);
    return new SuccessResult("Created");
}

async function update(id: number, post: Post): Promise<IResult> {
    const res: Result = await run(
        [
            { function: isExists, args: [id] }
        ]
    );
    if (!res.status) {
        return res;
    }

    await PostModel.findOneAndUpdate({ _id: id }, post, { new: true });
    return new SuccessResult("Post updated");
}

async function addComment(id: number, comment: Comment): Promise<IResult> {
    const res: Result = await run(
        [
            { function: isExists, args: [id] }
        ]
    );
    if (!res.status) {
        return res;
    }

    await PostModel.findOneAndUpdate({ _id: id }, { $push: { comments: comment } }, { new: true });
    return new SuccessResult("Post updated");
}

async function removeComment(postId: number, commentId: number): Promise<IResult> {
    const res: Result = await run(
        [
            { function: isExists, args: [postId] }
        ]
    );
    if (!res.status) {
        return res;
    }

    await PostModel.findOneAndUpdate({ _id: postId }, { $pull: { comments: { _id: commentId } } }, { new: true });
    return new SuccessResult("Post updated");
}

async function remove(id: number): Promise<IResult> {
    const res: Result = await run(
        [
            { function: isExists, args: [id] }
        ]
    );
    if (!res.status) {
        return res;
    }

    await PostModel.findOneAndDelete({ _id: id });
    return new SuccessResult("Post deleted");
}


// ---------- ---------- business rules ---------- ----------

async function isExists(id: number): Promise<IResult> {
    const post: any[] = await PostModel.find({ _id: id });
    if (post.length > 0) {
        return new SuccessResult();
    }
    return new ErrorResult("Post not exits");
}

// ---------- ---------- ---------- ---------- ----------



const PostService = { getAll, getByVisibility, getByUserId, add, update, addComment, removeComment, remove };
export default PostService;
