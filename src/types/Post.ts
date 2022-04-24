import Visibility from "./enums/Visibility";
import { Comment } from "./Comment";


interface Post {
    _id: string,
    owner: string,
    header: string,
    body: string,
    visibility: Visibility
    comments: Comment[],
    dateCreated: Date
};

interface PostAdd {
    owner: string,
    header: string,
    body: string,
    visibility: Visibility
};

interface PostUpdate {
    header: string,
    body: string,
    visibility: Visibility
};

interface PostSort {
    _id?: number,
    owner?: number,
    visibility?: number
    dateCreated?: number
};

export { Post, PostAdd, PostUpdate, PostSort };