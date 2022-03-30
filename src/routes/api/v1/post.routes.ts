import { Router } from 'express';
import PostController from '../../../controllers/post.controller';
import { allowForRoles } from '../../../core/middlewares/secured-operation';
import Roles from '../../../core/types/enums/Roles';

const PostRouter = Router();

PostRouter.get('/getAll', allowForRoles([Roles.ADMIN]), PostController.getAll); // ?field=username&asc=1

PostRouter.get('/getByVisibility/:visibility', PostController.getByVisibility);

PostRouter.get('/getByUserId/:userId', allowForRoles([Roles.USER, Roles.ADMIN]), PostController.getByUserId);

PostRouter.post('/add', PostController.add);

PostRouter.put('/update/:postId', PostController.update);

PostRouter.put('/addComment/:postId', PostController.addComment);

PostRouter.put('/removeComment/:postId/:commentId', PostController.removeComment);

PostRouter.delete('/:id', PostController.remove);

export default PostRouter;
