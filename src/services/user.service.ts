import { UserModel } from "../models/UserModel";
import { User, UserSort } from "../types/User";
import { IResult, Result, SuccessResult, ErrorResult } from "../core/results/Result";
import { IDataResult, DataResult, SuccessDataResult, ErrorDataResult } from "../core/results/DataResult";
import Status from "../types/enums/Status";
import run from "../core/utils/business-runner";
import Roles from "../types/enums/Roles";

import EncryptionService from '../core/services/encryption.service';



async function getAll(userSort?: UserSort): Promise<IDataResult<User[]>> {
    if (userSort) {
        return new SuccessDataResult(await UserModel.find({ status: { $ne: Status.DELETED } }).sort(userSort));
    }
    return new SuccessDataResult(await UserModel.find({ status: { $ne: Status.DELETED } }));
}

async function getById(id: number): Promise<DataResult<User | null>> {
    const res: Result = await run(
        [
            { function: isExists, args: [id] }
        ]
    );
    if (!res.status) {
        return new ErrorDataResult(null, res.message);
    }

    return new SuccessDataResult(await UserModel.findById(id));
}

async function getByUsername(username: string): Promise<IDataResult<User | null>> {
    const res: Result = await run(
        [
            { function: isExistsUsername, args: [username] }
        ]
    );
    if (!res.status) {
        return new ErrorDataResult(null, res.message);
    }
    const temp: any = await UserModel.findOne({ username: username, status: { $ne: Status.DELETED } });

    if (temp == null) {
        return new ErrorDataResult(null, "User not exits");
    }

    return new SuccessDataResult(temp);
}

async function add(user: User): Promise<IResult> {
    const res: Result = await run(
        [
            { function: isUsernameUnique, args: [user.username] },
            { function: isEmailUnique, args: [user.email] },
            { function: isStatusPossible, args: [user.status] },
            { function: isRolePossible, args: [user.role] }
        ]
    );
    if (!res.status) {
        return res;
    }

    user.password = await EncryptionService.hash(user.password)

    await UserModel.create(user);
    return new SuccessResult("Created");
}

async function update(id: number, user: User): Promise<IResult> {
    const res: Result = await run(
        [
            { function: isExists, args: [id] },
            { function: isUsernameUnique, args: [user.username, id] },
            { function: isEmailNotChanged, args: [user.email, id] },
            { function: isStatusPossible, args: [user.status] },
            { function: isRolePossible, args: [user.role] }
        ]
    );
    if (!res.status) {
        return res;
    }

    // If users password changed, re-encrypt it
    if (user.password) {
        const oldUser: User | null = await UserModel.findById(id);
        if (oldUser != null && !await EncryptionService.compare(user.password, oldUser.password)) {
            user.password = await EncryptionService.hash(user.password)
        }
    }

    await UserModel.findOneAndUpdate({ _id: id }, user, { new: true });
    return new SuccessResult("User updated");
}

async function remove(id: number): Promise<IResult> {
    const res: Result = await run(
        [
            { function: isExists, args: [id] }
        ]
    );
    if (!res.status) {
        return res;
    }

    await UserModel.findOneAndUpdate({ _id: id }, { status: Status.DELETED }, { new: true });
    return new SuccessResult("User deleted");
}

async function purge(id: number): Promise<IResult> {
    const res: Result = await run(
        [
            { function: isExists, args: [id] }
        ]
    );
    if (!res.status) {
        return res;
    }

    await UserModel.findOneAndDelete({ _id: id });
    return new SuccessResult("User purged");
}



// ---------- ---------- business rules ---------- ----------

async function isUsernameUnique(username: string, id?: number): Promise<IResult> {
    let user: any = null;
    if (id == undefined) {
        user = await UserModel.find({ username: username, status: { $ne: Status.DELETED } });
    }
    else {
        user = await UserModel.find({ _id: { $ne: id }, username: username, status: { $ne: Status.DELETED } });
    }

    if (user == null || user.length > 0) {
        return new ErrorResult("username is taken");
    }

    return new SuccessResult();
}

async function isEmailUnique(email: string, id?: number): Promise<IResult> {
    let user: any = null;
    if (id == undefined) {
        user = await UserModel.find({ email: email, status: { $ne: Status.DELETED } });
    }
    else {
        user = await UserModel.find({ _id: { $ne: id }, email: email, status: { $ne: Status.DELETED } });
    }

    if (user == null || user.length > 0) {
        return new ErrorResult("email is taken");
    }

    return new SuccessResult();
}

async function isEmailNotChanged(email: string, id: number): Promise<IResult> {
    if (email == null) {
        return new SuccessResult();
    }

    const user = await UserModel.find({ _id: { $ne: id }, status: { $ne: Status.DELETED } });
    if (user == null || user[0].email != email) {
        return new ErrorResult("Can not update email");
    }
    return new SuccessResult();
}

async function isExists(id: number): Promise<IResult> {
    const user: any[] = await UserModel.find({ _id: id, status: { $ne: Status.DELETED } });
    if (user.length > 0) {
        return new SuccessResult();
    }
    return new ErrorResult("User not exits");
}

async function isExistsUsername(username: string): Promise<IResult> {
    const user: any[] = await UserModel.find({ username: username, status: { $ne: Status.DELETED } });
    if (user.length > 0) {
        return new SuccessResult();
    }
    return new ErrorResult("User not exits");
}

async function isStatusPossible(status: Status): Promise<IResult> {
    if (status in Status || status == null) {
        return new SuccessResult();
    }
    return new ErrorResult("Status is not exists");
}

async function isRolePossible(role: Roles): Promise<IResult> {
    if (role in Roles || role == null) {
        return new SuccessResult();
    }
    return new ErrorResult("Role is not exists");
}

// ---------- ---------- ---------- ---------- ----------



const UserService = { getAll, getById, getByUsername, add, update, remove, purge };
export default UserService;
