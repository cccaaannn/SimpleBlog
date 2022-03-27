import { Schema } from "mongoose";

import Visibility from "./enums/Visibility";
import { Comment } from "./Comment";

interface Post {
    _id?: Schema.Types.ObjectId,
    owner: Schema.Types.ObjectId,
    header: string,
    body: string,
    visibility: Visibility
    comments: Comment,
    dateCreated: Date
};

interface PostSort {
    _id?: number,
    owner?: number,
    visibility?: number
    dateCreated?: number
};

export { Post, PostSort };