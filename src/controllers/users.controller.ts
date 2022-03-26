import { UserService } from "../services/user.service"
import { UserSort } from "../types/User";

async function getAll(req: any, res: any, next: any) {
    try {
        let userSort: UserSort|undefined = undefined;
        if(req.query.field && req.query.asc) {
            userSort = { [req.query.field]: req.query.asc };
        }

        res.json(await UserService.getAll(userSort));
    } catch (err: any) {
        console.error(`Error`, err.message);
        next(err);
    }
}

async function getById(req: any, res: any, next: any) {
    try {
        res.json(await UserService.getById(req.params.id));
    } catch (err: any) {
        console.error(`Error`, err.message);
        next(err);
    }
}

async function add(req: any, res: any, next: any) {
    try {
        res.json(await UserService.add(req.body));
    } catch (err: any) {
        console.error(`Error`, err.message);
        next(err);
    }
}

async function update(req: any, res: any, next: any) {
    try {
        res.json(await UserService.update(req.params.id, req.body));
    } catch (err: any) {
        console.error(`Error`, err.message);
        next(err);
    }
}

async function remove(req: any, res: any, next: any) {
    try {
        res.json(await UserService.remove(req.params.id));
    } catch (err: any) {
        console.error(`Error`, err.message);
        next(err);
    }
}

export const UserController = {
    getAll,
    getById,
    add,
    update,
    remove
};