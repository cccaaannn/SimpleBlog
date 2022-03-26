import { Schema } from "mongoose";
import Roles from "./enums/Roles";
import Status from "./enums/Status";

interface User {
    _id?: Schema.Types.ObjectId,
    username: string,
    email: string,
    password: string,
    status: Status,
    role: Roles,
    dateCreated: Date
};

interface UserSort {
    _id?: number
    username?: number,
    email?: number,
    status?: number,
    role?: number,
    dateCreated?: number
};

export { User, UserSort };