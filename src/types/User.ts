import Roles from "../core/types/enums/Roles";
import Status from "../core/types/enums/Status";

interface User {
    _id: string,
    username: string,
    email: string,
    password: string,
    status: Status,
    role: Roles,
    dateCreated: Date
};

interface UserAdd {
    username: string,
    email: string,
    password: string
};

interface UserUpdate {
    username: string,
    password?: string
};

interface UserSort {
    _id?: number
    username?: number,
    email?: number,
    status?: number,
    role?: number,
    dateCreated?: number
};

export { User, UserAdd, UserUpdate,  UserSort };