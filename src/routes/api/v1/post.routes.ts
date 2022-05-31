// Main lib imports
import { Router } from 'express';

// Project imports
import PostController from '../../../controllers/post.controller';
import { allowForRoles, decodeTokenIfExists, decodeAndVerifyToken } from '../../../core/middlewares/secured-operation.middleware';
import Roles from '../../../core/types/enums/Roles';


const PostRouter = Router();

// Post
PostRouter.get('/getAll', decodeTokenIfExists(), PostController.getAll);  // ?page=1&limit=5&sort=createdAt&asc=-1&category=Food

PostRouter.get('/getById/:id', decodeTokenIfExists(), PostController.getById);

PostRouter.get('/getByUserId/:userId', decodeTokenIfExists(), PostController.getByUserId);

PostRouter.post('/add', decodeAndVerifyToken(), allowForRoles([Roles.USER, Roles.ADMIN, Roles.SYS_ADMIN]), PostController.add);

PostRouter.put('/update/:postId', decodeAndVerifyToken(), allowForRoles([Roles.USER, Roles.ADMIN, Roles.SYS_ADMIN]), PostController.update);

PostRouter.delete('/delete/:id', decodeAndVerifyToken(), allowForRoles([Roles.USER, Roles.ADMIN, Roles.SYS_ADMIN]), PostController.remove);

// Comment
PostRouter.put('/addComment/:postId', decodeAndVerifyToken(), allowForRoles([Roles.USER, Roles.ADMIN, Roles.SYS_ADMIN]), PostController.addComment);

PostRouter.put('/removeComment/:postId/:commentId', decodeAndVerifyToken(), allowForRoles([Roles.USER, Roles.ADMIN, Roles.SYS_ADMIN]), PostController.removeComment);

// Likes
PostRouter.put('/addLike/:postId', decodeAndVerifyToken(), allowForRoles([Roles.USER, Roles.ADMIN, Roles.SYS_ADMIN]), PostController.addLike);

PostRouter.put('/removeLike/:postId', decodeAndVerifyToken(), allowForRoles([Roles.USER, Roles.ADMIN, Roles.SYS_ADMIN]), PostController.removeLike);


export default PostRouter;
