import { PostModel } from "../models/PostModel"
import { Post, PostAdd, PostSort, PostUpdate } from "../types/Post"
import { IResult, Result, SuccessResult, ErrorResult } from "../core/results/Result"
import { IDataResult, DataResult, SuccessDataResult, ErrorDataResult } from "../core/results/DataResult"
import run from "../core/utils/business-runner";
import { TokenPayload } from "../core/types/TokenPayload";
import Roles from "../core/types/enums/Roles";
import { CommentAdd } from "../types/Comment";
import Visibility from "../types/enums/Visibility";
import Category from "../types/enums/Category";
import { Pagination } from "../core/types/Pagination";
import { UserModel } from "../models/UserModel";
import Status from "../core/types/enums/Status";
import { LikeAdd } from "../types/Like";


async function getAll({ tokenPayload, page, limit, category, sort, asc }: { tokenPayload?: TokenPayload, page?: number, limit?: number, category?: Category, sort?: string, asc?: number }): Promise<IDataResult<Pagination<Post>>> {

    let categoryFilter: Category[] = Object.values(Category);
    if (category && category != Category.ALL) {
        categoryFilter = [category];
    }

    const sortMethod = sort ? sort : "createdAt";
    const postSort = { [sortMethod]: asc ? asc : -1 };

    // Everyone can see Visibility.PUBLIC
    let visibilityFilter: Visibility[] = [Visibility.PUBLIC]

    // Admin or user itself
    if (tokenPayload) {
        visibilityFilter.push(Visibility.MEMBERS);
    }

    const query = { visibility: { $in: visibilityFilter }, category: { $in: categoryFilter } };

    const count = await PostModel.countDocuments(query);

    const page_ = page ? page - 1 : 0;
    const limit_ = limit ? limit : count;

    const posts: any = await PostModel
        .find(query, { comments: 0 })
        .populate("owner", "_id username")
        .sort(postSort)
        .skip(page_ * limit_)
        .limit(limit_);

    const paginatedPosts: Pagination<Post> = { data: posts, page: parseInt(page_ + 1 + ""), pageSize: parseInt(limit_ + ""), totalItems: count, totalPages: Math.ceil(count / limit_) }

    return new SuccessDataResult(paginatedPosts);
}

async function getByUserId({ userId, tokenPayload, page, limit, category, sort, asc }: { userId: string, tokenPayload?: TokenPayload, page?: number, limit?: number, category?: Category, sort?: string, asc?: number }): Promise<IDataResult<Pagination<Post>>> {

    let categoryFilter: Category[] = Object.values(Category);
    if (category != null && category != Category.ALL) {
        categoryFilter = [category];
    }

    const sortMethod = sort ? sort : "createdAt";
    const postSort = { [sortMethod]: asc ? asc : -1 };

    // Everyone can see Visibility.PUBLIC
    let visibilityFilter: Visibility[] = [Visibility.PUBLIC]

    // Admin or user itself
    if (tokenPayload != null) {
        visibilityFilter.push(Visibility.MEMBERS);
    }
    // Regular members
    if (tokenPayload != null && (tokenPayload.role == Roles.ADMIN || tokenPayload.role == Roles.SYS_ADMIN || tokenPayload.id == userId)) {
        visibilityFilter.push(Visibility.PRIVATE);
    }

    const query = { owner: { $eq: userId }, visibility: { $in: visibilityFilter }, category: { $in: categoryFilter } };

    const count = await PostModel.countDocuments(query);

    const page_ = page ? page - 1 : 0;
    const limit_ = limit ? limit : count;

    const posts: any = await PostModel
        .find(query)
        .populate("owner", "_id username")
        .sort(postSort)
        .skip(page_ * limit_)
        .limit(limit_);

    const paginatedPosts: Pagination<Post> = { data: posts, page: parseInt(page_ + 1 + ""), pageSize: parseInt(limit_ + ""), totalItems: count, totalPages: Math.ceil(count / limit_) }

    return new SuccessDataResult(paginatedPosts);
}

async function getById(id: string, tokenPayload?: TokenPayload): Promise<IDataResult<Post | null>> {
    const res: Result = await run(
        [
            { function: isExists, args: [id] },
        ]
    );
    if (!res.status) {
        return new ErrorDataResult(null, res.message);
    }

    const post: Post | any = await PostModel.findById(id).populate({ path: "owner", select: "_id username" }).populate({ path: "comments.owner", select: "_id username" });

    if (post.visibility == Visibility.PUBLIC) {
        return new SuccessDataResult(post);
    }

    if (!tokenPayload) {
        return new ErrorDataResult(null, "Not authorized");
    }

    if (post.visibility == Visibility.MEMBERS) {
        return new SuccessDataResult(post);
    }

    if (post.visibility == Visibility.PRIVATE) {
        const authorizationResult: IResult = await isUserAllowedForOperation(id, tokenPayload);
        if (authorizationResult.status) {
            return new SuccessDataResult(post);
        }
    }

    return new ErrorDataResult(null, "Not authorized");
}

async function add(post: PostAdd, tokenPayload: TokenPayload): Promise<IDataResult<Post | null>> {
    const res: Result = await run(
        [
            { function: isUserExists, args: [tokenPayload.id] }
        ]
    );
    if (!res.status) {
        return new ErrorDataResult(null, res.message);
    }

    let visibility: Visibility = Visibility.PUBLIC;
    if (Object.values(Visibility).includes(post.visibility as Visibility)) {
        visibility = post.visibility as Visibility
    }

    // Category validation, posts can not be on Category.ALL
    let category: Category = Category.GENERAL;
    if (Object.values(Category).includes(post.category as Category) && post.category != Category.ALL) {
        category = post.category as Category
    }

    const postToAdd: PostAdd = {
        owner: tokenPayload.id,
        header: post.header,
        body: post.body,
        image: post.image,
        category: category,
        visibility: visibility
    }

    return new SuccessDataResult(await PostModel.create(postToAdd), "Created");
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
        image: post.image,
        category: post.category,
        visibility: post.visibility
    }

    await PostModel.findOneAndUpdate({ _id: id }, postToUpdate, { new: true });
    return new SuccessResult("Post updated");
}

async function addComment(id: string, comment: CommentAdd, tokenPayload: TokenPayload): Promise<IResult> {
    const res: Result = await run(
        [
            { function: isUserExists, args: [tokenPayload.id] },
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

    await PostModel.findOneAndUpdate({ _id: id }, { $push: { comments: commentToAdd } }, { new: true, timestamps: false });
    return new SuccessResult("Post updated");
}

async function removeComment(postId: string, commentId: string, tokenPayload: TokenPayload): Promise<IResult> {
    const res: Result = await run(
        [
            { function: isUserExists, args: [tokenPayload.id] },
            { function: isExists, args: [postId] },
            { function: isUserAllowedToDeleteComment, args: [postId, commentId, tokenPayload] }
        ]
    );
    if (!res.status) {
        return res;
    }

    await PostModel.findOneAndUpdate({ _id: postId }, { $pull: { comments: { _id: commentId } } }, { new: true, timestamps: false });
    return new SuccessResult("Post updated");
}

async function addLike(id: string, tokenPayload: TokenPayload): Promise<IResult> {
    const res: Result = await run(
        [
            { function: isUserExists, args: [tokenPayload.id] },
            { function: isExists, args: [id] },
            { function: isUserNotLikedBefore, args: [id, tokenPayload.id] }
        ]
    );
    if (!res.status) {
        return res;
    }

    const likeToAdd: LikeAdd = {
        owner: tokenPayload.id
    }

    await PostModel.findOneAndUpdate({ _id: id }, { $push: { likes: likeToAdd } }, { new: true, timestamps: false });
    return new SuccessResult("Liked");
}

async function removeLike(id: string, tokenPayload: TokenPayload): Promise<IResult> {
    const res: Result = await run(
        [
            { function: isUserExists, args: [tokenPayload.id] },
            { function: isExists, args: [id] },
            { function: isUserLikedBefore, args: [id, tokenPayload.id] }
        ]
    );
    if (!res.status) {
        return res;
    }

    await PostModel.findOneAndUpdate({ _id: id }, { $pull: { likes: { owner: tokenPayload.id } } }, { new: true, timestamps: false });
    return new SuccessResult("Un liked");
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
    const res: any = await PostModel.findOne({ _id: operatingPostId, $in: { comments: { _id: operatingCommentId, owner: tokenPayload.id } } });

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

async function isUserExists(id: string): Promise<IResult> {
    const user: any[] = await UserModel.find({ _id: id, status: { $ne: Status.DELETED } });
    if (user.length > 0) {
        return new SuccessResult();
    }
    return new ErrorResult("User not exits");
}

async function isUserNotLikedBefore(id: string, userId: string): Promise<IResult> {
    const posts: any = await PostModel.findOne({ _id: id, likes: { $elemMatch: { owner: userId } } });
    if (posts !== null) {
        return new ErrorResult("Post liked before");
    }
    return new SuccessResult();
}

async function isUserLikedBefore(id: string, userId: string): Promise<IResult> {
    const posts: any = await PostModel.findOne({ _id: id, likes: { $elemMatch: { owner: userId } } });
    if (posts !== null) {
        return new SuccessResult();
    }
    return new ErrorResult("Post not liked before");
}

// async function isUserOwnsPost(userId: string, postId: string): Promise<IResult> {
//     const res: any = await PostModel.findOne({ _id: postId, owner: { $eq: userId } });
//     if(res == null) {
//         return new ErrorResult("User Does not owns this post");
//     }
//     return new SuccessResult();
// }

// ---------- ---------- ---------- ---------- ----------



const PostService = { getAll, getByUserId, getById, add, update, addComment, removeComment, addLike, removeLike, remove };
export default PostService;
