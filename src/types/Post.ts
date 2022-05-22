import Visibility from "./enums/Visibility";
import { Comment } from "./Comment";
import Category from "./enums/Category";


interface Post {
    _id: string,
    owner: string,
    header: string,
    body: string,
    image: string,
    category: Category,
    visibility: Visibility,
    comments: Comment[],
    createdAt: Date,
    updatedAt: Date
};

interface PostAdd {
    owner: string,
    header: string,
    body: string,
    image: string,
    category: Category,
    visibility: Visibility
};

interface PostUpdate {
    header: string,
    body: string,
    image: string,
    category: Category,
    visibility: Visibility
};

interface PostSort {
    visibility?: number,
    createdAt?: number,
    updatedAt?: number
};

export { Post, PostAdd, PostUpdate, PostSort };