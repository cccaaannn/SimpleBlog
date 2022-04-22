import { Schema } from "mongoose";

interface Comment {
    _id: string,
    owner: string,
    comment: string,
    dateCreated: Date
};

interface CommentAdd {
    owner: string,
    comment: string,
};


export { Comment, CommentAdd };