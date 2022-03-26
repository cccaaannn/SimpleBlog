import { Router } from 'express';
import { PostController } from '../../controllers/post.controller';

const router = Router();

router.get('/getAll', PostController.getAll); // ?field=username&asc=1

router.get('/getByVisibility/:visibility', PostController.getByVisibility);

router.get('/getByUserId/:userId', PostController.getByUserId);

router.post('/', PostController.add);

router.put('/update/:id', PostController.update);

router.put('/addComment/:id', PostController.addComment);

router.put('/removeComment/:postId/:commentId', PostController.removeComment);

router.delete('/:id', PostController.remove);


export { router };
