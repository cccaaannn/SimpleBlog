import UserService from "../services/user.service"
import { UserSort } from "../types/User";

async function getAll(req: any, res: any, next: any) {
    try {
        let userSort: UserSort | undefined = undefined;
        if (req.query.field && req.query.asc) {
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
        res.json(await UserService.update(req.params.id, req.body, res.locals.tokenPayload));
    } catch (err: any) {
        console.error(`Error`, err.message);
        next(err);
    }
}

async function changeRole(req: any, res: any, next: any) {
    try {
        res.json(await UserService.changeRole(req.params.id, req.params.role));
    } catch (err: any) {
        console.error(`Error`, err.message);
        next(err);
    }
}

async function suspend(req: any, res: any, next: any) {
    try {
        res.json(await UserService.suspend(req.params.id));
    } catch (err: any) {
        console.error(`Error`, err.message);
        next(err);
    }
}

async function activate(req: any, res: any, next: any) {
    try {
        res.json(await UserService.activate(req.params.id));
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

async function purge(req: any, res: any, next: any) {
    try {
        res.json(await UserService.purge(req.params.id, res.locals.tokenPayload));
    } catch (err: any) {
        console.error(`Error`, err.message);
        next(err);
    }
}

const UserController = { getAll, getById, add, update, changeRole, suspend, activate, remove, purge };
export default UserController;
