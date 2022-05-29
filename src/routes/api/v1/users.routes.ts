// Main lib imports
import { Router } from 'express';

// Project imports
import UserController from '../../../controllers/users.controller';
import { allowForRoles } from '../../../core/middlewares/secured-operation.middleware';
import { bodyTrimer } from '../../../core/middlewares/body-trimer.middleware';
import Roles from '../../../core/types/enums/Roles';

const usersRouter = Router();

// User - Admin
usersRouter.put('/update/:id', allowForRoles([Roles.USER, Roles.ADMIN, Roles.SYS_ADMIN]), bodyTrimer(), UserController.update);

usersRouter.delete('/purge/:id', allowForRoles([Roles.USER, Roles.ADMIN, Roles.SYS_ADMIN]), UserController.purge);


// Admin
usersRouter.get('/getAll', allowForRoles([Roles.ADMIN, Roles.SYS_ADMIN]), UserController.getAll); // ?field=username&asc=1

usersRouter.get('/getById/:id', allowForRoles([Roles.ADMIN, Roles.SYS_ADMIN]), UserController.getById);

usersRouter.put('/activate/:id', allowForRoles([Roles.ADMIN, Roles.SYS_ADMIN]), UserController.activate);

usersRouter.put('/suspend/:id', allowForRoles([Roles.ADMIN, Roles.SYS_ADMIN]), UserController.suspend);

// usersRouter.delete('/delete/:id', allowForRoles([Roles.ADMIN]), UserController.remove);


// SYS_ADMIN
usersRouter.put('/changeRole/:id/:role', allowForRoles([Roles.SYS_ADMIN]), UserController.changeRole);


export default usersRouter;