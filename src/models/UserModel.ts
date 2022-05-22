import mongoose, { Schema } from "mongoose";
import Roles from "../core/types/enums/Roles";
import Status from "../core/types/enums/Status";

const UserSchema = new Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        status: { type: String, default: Status.PASSIVE },
        role: { type: String, default: Roles.USER }
    },
    {
        timestamps: true
    }
);

const UserModel = mongoose.model('User', UserSchema);

export { UserModel };