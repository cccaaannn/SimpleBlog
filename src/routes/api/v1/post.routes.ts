// Main lib imports
import { Router } from 'express';

// Project imports
import PostController from '../../../controllers/post.controller';
import { allowForRoles, extractAndValidateToken } from '../../../core/middlewares/secured-operation.middleware';
import Roles from '../../../core/types/enums/Roles';


const PostRouter = Router();

// Post
// PostRouter.get('/getAllPublic', PostController.getAll);

PostRouter.get('/getAll', extractAndValidateToken(), allowForRoles([Roles.ADMIN]), PostController.getAll); // ?field=username&asc=1

PostRouter.get('/getForPublic', PostController.getForPublic);

PostRouter.get('/getForMembers', extractAndValidateToken(), allowForRoles([Roles.USER, Roles.ADMIN]), PostController.getForMembers);

PostRouter.get('/getByUserId/:userId', extractAndValidateToken(), allowForRoles([Roles.USER, Roles.ADMIN]), PostController.getByUserId);

PostRouter.post('/add', extractAndValidateToken(), allowForRoles([Roles.USER, Roles.ADMIN]), PostController.add);

PostRouter.put('/update/:postId', extractAndValidateToken(), allowForRoles([Roles.USER, Roles.ADMIN]), PostController.update);

PostRouter.delete('/delete/:id', extractAndValidateToken(), allowForRoles([Roles.USER, Roles.ADMIN]), PostController.remove);

// Comment
PostRouter.put('/addComment/:postId', extractAndValidateToken(), allowForRoles([Roles.USER, Roles.ADMIN]), PostController.addComment);

PostRouter.put('/removeComment/:postId/:commentId', extractAndValidateToken(), allowForRoles([Roles.USER, Roles.ADMIN]), PostController.removeComment);


export default PostRouter;
