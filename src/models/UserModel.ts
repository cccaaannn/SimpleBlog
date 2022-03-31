import mongoose, { Schema } from "mongoose";
import Roles from "../core/types/enums/Roles";
import Status from "../types/enums/Status";

const UserSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    status: { type: String, default: Status.PASSIVE },
    role: { type: String, default: Roles.USER },
    dateCreated: { type: Date, default: Date.now }
});

const UserModel = mongoose.model('User', UserSchema);

export { UserModel };