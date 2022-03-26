import { Schema } from "mongoose";

interface Comment {
    _id?: Schema.Types.ObjectId,
    owner: string,
    comment: string,
    dateCreated: Date
};

export { Comment };