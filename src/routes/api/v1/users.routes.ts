import { Router } from 'express';
import UserController from '../../../controllers/users.controller';
import { allowForRoles } from '../../../core/middlewares/secured-operation';
import Roles from '../../../core/types/enums/Roles';

const usersRouter = Router();

usersRouter.get('/getAll', allowForRoles([Roles.ADMIN, Roles.USER]), UserController.getAll); // ?field=username&asc=1

usersRouter.get('/getById/:id', allowForRoles([Roles.ADMIN, Roles.USER]), UserController.getById);

usersRouter.post('/add', allowForRoles([Roles.ADMIN, Roles.USER]), UserController.add);

usersRouter.put('/update/:id', allowForRoles([Roles.ADMIN, Roles.USER]), UserController.update);

usersRouter.delete('/purge/:id', allowForRoles([Roles.ADMIN, Roles.USER]), UserController.purge);


usersRouter.put('/changeRole/:id/:role', allowForRoles([Roles.ADMIN]), UserController.changeRole);

usersRouter.put('/activate/:id', allowForRoles([Roles.ADMIN]), UserController.activate);

usersRouter.put('/suspend/:id', allowForRoles([Roles.ADMIN]), UserController.suspend);

usersRouter.delete('/delete/:id', allowForRoles([Roles.ADMIN]), UserController.remove);


export default usersRouter;