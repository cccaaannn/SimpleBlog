interface Comment {
    _id: string,
    owner: string,
    comment: string,
    createdAt: Date,
    updatedAt: Date
};

interface CommentAdd {
    owner: string,
    comment: string,
};


export { Comment, CommentAdd };