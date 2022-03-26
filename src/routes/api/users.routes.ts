import { Router } from 'express';
import { UserController } from '../../controllers/users.controller';

const router = Router();

router.get('/', UserController.getAll); // ?field=username&asc=1

router.get('/:id', UserController.getById);

router.post('/', UserController.add);

router.put('/:id', UserController.update);

router.delete('/:id', UserController.remove);

export { router };