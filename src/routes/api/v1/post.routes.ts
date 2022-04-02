// Main lib imports
import { Router } from 'express';

// Project imports
import PostController from '../../../controllers/post.controller';
import { allowForRoles } from '../../../core/middlewares/secured-operation';
import Roles from '../../../core/types/enums/Roles';

const PostRouter = Router();

// Post
// PostRouter.get('/getAllPublic', PostController.getAll);

PostRouter.get('/getAll', allowForRoles([Roles.ADMIN]), PostController.getAll); // ?field=username&asc=1

PostRouter.get('/getByVisibility/:visibility', allowForRoles([Roles.USER, Roles.ADMIN]), PostController.getByVisibility);

PostRouter.get('/getByUserId/:userId', allowForRoles([Roles.USER, Roles.ADMIN]), PostController.getByUserId);

PostRouter.post('/add', allowForRoles([Roles.USER, Roles.ADMIN]), PostController.add);

PostRouter.put('/update/:postId', allowForRoles([Roles.USER, Roles.ADMIN]), PostController.update);

PostRouter.delete('/delete/:id', allowForRoles([Roles.USER, Roles.ADMIN]), PostController.remove);

// Comment
PostRouter.put('/addComment/:postId', allowForRoles([Roles.USER, Roles.ADMIN]), PostController.addComment);

PostRouter.put('/removeComment/:postId/:commentId', allowForRoles([Roles.USER, Roles.ADMIN]), PostController.removeComment);


export default PostRouter;
