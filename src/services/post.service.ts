import { PostModel } from "../models/PostModel"
import { Post, PostAdd, PostSort, PostUpdate } from "../types/Post"
import { IResult, Result, SuccessResult, ErrorResult } from "../core/results/Result"
import { IDataResult, DataResult, SuccessDataResult, ErrorDataResult } from "../core/results/DataResult"
import run from "../core/utils/business-runner";
import { TokenPayload } from "../core/types/TokenPayload";
import Roles from "../core/types/enums/Roles";
import { CommentAdd } from "../types/Comment";
import Visibility from "../types/enums/Visibility";


async function getAll(postSort?: PostSort): Promise<IDataResult<Post[]>> {
    if (postSort) {
        return new SuccessDataResult(await PostModel.find().sort(postSort));
    }
    return new SuccessDataResult(await PostModel.find());
}

async function getForPublic(postSort?: PostSort): Promise<IDataResult<Post[]>> {
    if (postSort) {
        return new SuccessDataResult(await PostModel.find({ visibility: { $eq: Visibility.PUBLIC } }).sort(postSort));
    }
    return new SuccessDataResult(await PostModel.find({ visibility: { $eq: Visibility.PUBLIC } }));
}

async function getForMembers(postSort?: PostSort): Promise<IDataResult<Post[]>> {
    if (postSort) {
        return new SuccessDataResult(await PostModel.find({ visibility: { $in: [Visibility.PUBLIC, Visibility.MEMBERS] } }).sort(postSort));
    }
    return new SuccessDataResult(await PostModel.find({ visibility: { $in: [Visibility.PUBLIC, Visibility.MEMBERS] } }));
}

async function getByUserId(userId: string, postSort?: PostSort): Promise<IDataResult<Post[]>> {
    if (postSort) {
        return new SuccessDataResult(await PostModel.find({ owner: { $eq: userId } }).sort(postSort));
    }
    return new SuccessDataResult(await PostModel.find({ owner: { $eq: userId } }));
}

async function add(post: PostAdd, tokenPayload: TokenPayload): Promise<IResult> {

    let visibility: Visibility = Visibility.PUBLIC;
    if(Object.values(Visibility).includes(post.visibility as Visibility)) {
        visibility = post.visibility as Visibility
    }

    const postToAdd: PostAdd = {
        owner: tokenPayload.id,
        header: post.header,
        body: post.body,
        visibility: visibility
    }

    await PostModel.create(postToAdd);
    return new SuccessResult("Created");
}

async function update(id: string, post: PostUpdate, tokenPayload: TokenPayload): Promise<IResult> {
    const res: Result = await run(
        [
            { function: isExists, args: [id] },
            { function: isUserAllowedForOperation, args: [id, tokenPayload] }
        ]
    );
    if (!res.status) {
        return res;
    }

    const postToUpdate: PostUpdate = {
        header: post.header,
        body: post.body,
        visibility: post.visibility
    }

    await PostModel.findOneAndUpdate({ _id: id }, postToUpdate, { new: true });
    return new SuccessResult("Post updated");
}

async function addComment(id: string, comment: CommentAdd, tokenPayload: TokenPayload): Promise<IResult> {
    const res: Result = await run(
        [
            { function: isExists, args: [id] }
        ]
    );
    if (!res.status) {
        return res;
    }

    const commentToAdd: CommentAdd = {
        owner: tokenPayload.id,
        comment: comment.comment
    }

    await PostModel.findOneAndUpdate({ _id: id }, { $push: { comments: commentToAdd } }, { new: true });
    return new SuccessResult("Post updated");
}

async function removeComment(postId: string, commentId: string, tokenPayload: TokenPayload): Promise<IResult> {
    const res: Result = await run(
        [
            { function: isExists, args: [postId] },
            { function: isUserAllowedToDeleteComment, args: [postId, commentId, tokenPayload] }
        ]
    );
    if (!res.status) {
        return res;
    }

    await PostModel.findOneAndUpdate({ _id: postId }, { $pull: { comments: { _id: commentId } } }, { new: true });
    return new SuccessResult("Post updated");
}

async function remove(id: string, tokenPayload: TokenPayload): Promise<IResult> {
    const res: Result = await run(
        [
            { function: isExists, args: [id] },
            { function: isUserAllowedForOperation, args: [id, tokenPayload] }
        ]
    );
    if (!res.status) {
        return res;
    }

    await PostModel.findOneAndDelete({ _id: id });
    return new SuccessResult("Post deleted");
}


// ---------- ---------- business rules ---------- ----------

async function isUserAllowedForOperation(operatingPostId: string, tokenPayload: TokenPayload): Promise<IResult> {
    if (tokenPayload.role == Roles.ADMIN || tokenPayload.role == Roles.SYS_ADMIN) {
        return new SuccessResult();
    }

    // Is user owns post
    const res: any = await PostModel.findOne({ _id: operatingPostId, owner: { $eq: tokenPayload.id } });
    if (res == null) {
        return new ErrorResult("User Does not owns this post");
    }

    return new SuccessResult();
}

async function isUserAllowedToDeleteComment(operatingPostId: string, operatingCommentId: string, tokenPayload: TokenPayload): Promise<IResult> {
    if (tokenPayload.role == Roles.ADMIN || tokenPayload.role == Roles.SYS_ADMIN) {
        return new SuccessResult();
    }

    // Is user owns comment
    const res: any = await PostModel.findOne({ _id: operatingPostId, comments: { _id: operatingCommentId, owner: tokenPayload.id } });
    if (res == null) {
        return new ErrorResult("User Does not owns this comment");
    }

    return new SuccessResult();
}

async function isExists(id: string): Promise<IResult> {
    const post: any[] = await PostModel.find({ _id: id });
    if (post.length > 0) {
        return new SuccessResult();
    }
    return new ErrorResult("Post not exits");
}

// async function isUserOwnsPost(userId: string, postId: string): Promise<IResult> {
//     const res: any = await PostModel.findOne({ _id: postId, owner: { $eq: userId } });
//     if(res == null) {
//         return new ErrorResult("User Does not owns this post");
//     }
//     return new SuccessResult();
// }

// ---------- ---------- ---------- ---------- ----------



const PostService = { getAll, getForPublic, getForMembers, getByUserId, add, update, addComment, removeComment, remove };
export default PostService;
