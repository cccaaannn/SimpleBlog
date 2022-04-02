// Main lib imports
import { Router } from 'express';

// Project imports
import UserController from '../../../controllers/users.controller';
import { allowForRoles } from '../../../core/middlewares/secured-operation';
import Roles from '../../../core/types/enums/Roles';

const usersRouter = Router();

// User - Admin
// usersRouter.post('/add', allowForRoles([Roles.ADMIN, Roles.USER]), UserController.add);

usersRouter.put('/update/:id', allowForRoles([Roles.ADMIN, Roles.USER]), UserController.update);

usersRouter.delete('/purge/:id', allowForRoles([Roles.ADMIN, Roles.USER]), UserController.purge);


// Admin
usersRouter.get('/getAll', allowForRoles([Roles.ADMIN]), UserController.getAll); // ?field=username&asc=1

usersRouter.get('/getById/:id', allowForRoles([Roles.ADMIN]), UserController.getById);

usersRouter.put('/changeRole/:id/:role', allowForRoles([Roles.ADMIN]), UserController.changeRole);

usersRouter.put('/activate/:id', allowForRoles([Roles.ADMIN]), UserController.activate);

usersRouter.put('/suspend/:id', allowForRoles([Roles.ADMIN]), UserController.suspend);

usersRouter.delete('/delete/:id', allowForRoles([Roles.ADMIN]), UserController.remove);


export default usersRouter;