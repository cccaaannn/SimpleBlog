// Project imports
import { IResult } from "../core/results/Result";
import PostService from "../services/post.service"
import { PostSort } from "../types/Post";

async function getAll(req: any, res: any, next: any) {
    try {
        let postSort: PostSort | undefined = undefined;
        if (req.query.field && req.query.asc) {
            postSort = { [req.query.field]: req.query.asc };
        }

        const result: IResult = await PostService.getAll(postSort);
        if(result.status) {
            return res.status(200).json(result);
        }
        return res.status(400).json(result);
    } 
    catch (err: any) {
        res.locals.err = err;
        next();
    }
}

async function getByVisibility(req: any, res: any, next: any) {
    try {
        let postSort: PostSort | undefined = undefined;
        if (req.query.field && req.query.asc) {
            postSort = { [req.query.field]: req.query.asc };
        }

        const result: IResult = await PostService.getByVisibility(req.params.visibility, postSort);
        if(result.status) {
            return res.status(200).json(result);
        }
        return res.status(400).json(result);
    } 
    catch (err: any) {
        res.locals.err = err;
        next();
    }
}

async function getByUserId(req: any, res: any, next: any) {
    try {
        let postSort: PostSort | undefined = undefined;
        if (req.query.field && req.query.asc) {
            postSort = { [req.query.field]: req.query.asc };
        }

        const result: IResult = await PostService.getByUserId(req.params.userId, postSort);
        if(result.status) {
            return res.status(200).json(result);
        }
        return res.status(400).json(result);
    } 
    catch (err: any) {
        res.locals.err = err;
        next();
    }
}

async function add(req: any, res: any, next: any) {
    try {
        const result: IResult = await PostService.add(req.body, res.locals.tokenPayload);
        if(result.status) {
            return res.status(200).json(result);
        }
        return res.status(400).json(result);
    } 
    catch (err: any) {
        res.locals.err = err;
        next();
    }
}

async function update(req: any, res: any, next: any) {
    try {
        const result: IResult = await PostService.update(req.params.postId, req.body, res.locals.tokenPayload);
        if(result.status) {
            return res.status(200).json(result);
        }
        return res.status(400).json(result);
    } 
    catch (err: any) {
        res.locals.err = err;
        next();
    }
}

async function addComment(req: any, res: any, next: any) {
    try {
        const result: IResult = await PostService.addComment(req.params.postId, req.body, res.locals.tokenPayload);
        if(result.status) {
            return res.status(200).json(result);
        }
        return res.status(400).json(result);
    } 
    catch (err: any) {
        res.locals.err = err;
        next();
    }
}

async function removeComment(req: any, res: any, next: any) {
    try {
        const result: IResult = await PostService.removeComment(req.params.postId, req.params.commentId, res.locals.tokenPayload);
        if(result.status) {
            return res.status(200).json(result);
        }
        return res.status(400).json(result);
    } 
    catch (err: any) {
        res.locals.err = err;
        next();
    }
}

async function remove(req: any, res: any, next: any) {
    try {
        const result: IResult = await PostService.remove(req.params.id, res.locals.tokenPayload);
        if(result.status) {
            return res.status(200).json(result);
        }
        return res.status(400).json(result);
    } 
    catch (err: any) {
        res.locals.err = err;
        next();
    }
}


const PostController = { getAll, getByVisibility, getByUserId, add, update, addComment, removeComment, remove };
export default PostController;
