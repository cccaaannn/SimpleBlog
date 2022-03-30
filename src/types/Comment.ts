import { Schema } from "mongoose";

interface Comment {
    _id?: Schema.Types.ObjectId,
    owner: string,
    comment: string,
    dateCreated: Date
};

interface CommentAdd {
    owner: string,
    comment: string,
};


export { Comment, CommentAdd };