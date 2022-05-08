// Project imports
import { IResult } from "../core/results/Result";
import { TokenPayload } from "../core/types/TokenPayload";
import PostService from "../services/post.service"
import Category from "../types/enums/Category";
import { PostSort } from "../types/Post";


async function getAll(req: any, res: any, next: any) {
    try {
        let tokenPayload: TokenPayload | null = null;
        if (res.locals.tokenPayload) {
            tokenPayload = res.locals.tokenPayload;
        }

        let postSort: PostSort | null = null;
        if (req.query.field && req.query.asc) {
            postSort = { [req.query.field]: req.query.asc };
        }

        let category: Category | null = null;
        if (req.query.category) {
            category = req.query.category;
        }

        const result: IResult = await PostService.getAll(tokenPayload, category, postSort);
        if(result.status) {
            return res.status(200).json(result);
        }
        return res.status(400).json(result);
    } 
    catch (err: any) {
        console.log(err);
        
        res.locals.err = err;
        next();
    }
}

async function getByUserId(req: any, res: any, next: any) {
    try {
        let tokenPayload: TokenPayload | null = null;
        if (res.locals.tokenPayload) {
            tokenPayload = res.locals.tokenPayload;
        }

        let postSort: PostSort | null = null;
        if (req.query.field && req.query.asc) {
            postSort = { [req.query.field]: req.query.asc };
        }

        let category: Category | null = null;
        if (req.query.category) {
            category = req.query.category;
        }

        const result: IResult = await PostService.getByUserId(req.params.userId, tokenPayload, category, postSort);
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

async function getById(req: any, res: any, next: any) {
    try {
        let tokenPayload: TokenPayload | undefined = undefined;
        if (res.locals.tokenPayload && res.locals.tokenPayload != null) {
            tokenPayload = res.locals.tokenPayload;
        }

        const result: IResult = await PostService.getById(req.params.id, tokenPayload);
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


const PostController = { getAll, getById, getByUserId, add, update, addComment, removeComment, remove };
export default PostController;
