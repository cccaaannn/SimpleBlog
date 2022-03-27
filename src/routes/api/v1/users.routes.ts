import { Router } from 'express';
import UserController from '../../../controllers/users.controller';

const usersRouter = Router();

usersRouter.get('/', UserController.getAll); // ?field=username&asc=1

usersRouter.get('/:id', UserController.getById);

usersRouter.post('/', UserController.add);

usersRouter.put('/:id', UserController.update);

usersRouter.delete('/:id', UserController.remove);

export default usersRouter;