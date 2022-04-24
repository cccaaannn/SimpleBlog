import Roles from "../../../src/core/types/enums/Roles";
import Status from "../../../src/types/enums/Status";
import Visibility from "../../../src/types/enums/Visibility";
import { Post, PostAdd, PostSort, PostUpdate } from "../../../src/types/Post";
import { TokenPayload } from '../../../src/core/types/TokenPayload';
import { CommentAdd } from "../../../src/types/Comment";


export namespace MockValues {
    export const mUserId1 = "user1";
    export const mUserId2 = "user2";
    export const mUserId3 = "user3";

    export const mPostId1 = "post1";
    export const mPostId2 = "post2";
    export const mPostId3 = "post3";

    export const mCommentId1 = "comment1";
    export const mCommentId2 = "comment2";
    export const mCommentId3 = "comment3";

    export const mDateNow = new Date();
    export const mPostsFull: Post[] = [
        {
            _id: mPostId1,
            owner: mUserId1,
            header: "mock_data",
            body: "mock_data",
            visibility: Visibility.PUBLIC,
            comments: [
                {
                    _id: mCommentId1,
                    owner: "mock_data",
                    comment: "mock_data",
                    dateCreated: mDateNow
                }
            ],
            dateCreated: mDateNow
        },
        {
            _id: mPostId2,
            owner: mUserId2,
            header: "mock_data",
            body: "mock_data",
            visibility: Visibility.PUBLIC,
            comments: [
                {
                    _id: mCommentId2,
                    owner: "mock_data",
                    comment: "mock_data",
                    dateCreated: mDateNow
                }
            ],
            dateCreated: mDateNow
        }
    ]

    export const mPostsEmpty: Post[] = []

    export const mPost1: Post = {
        _id: mPostId1,
        owner: mUserId1,
        header: "mock_data",
        body: "mock_data",
        visibility: Visibility.PUBLIC,
        comments: [
            {
                _id: mCommentId1,
                owner: "mock_data",
                comment: "mock_data",
                dateCreated: mDateNow
            }
        ],
        dateCreated: mDateNow
    }


    export const mPostSort: PostSort = {
        visibility: 1
    }

    export const mPostSorter: any = {
        sort: function () {
            return mPostsFull
        }
    }

    export const mTokenPayloadUser1: TokenPayload = {
        id: mUserId1,
        status: Status.ACTIVE,
        username: "mock_data",
        email: "mock_data",
        role: Roles.USER,
    }

    export const mTokenPayloadAdmin: TokenPayload = {
        id: mUserId2,
        status: Status.ACTIVE,
        username: "mock_data",
        email: "mock_data",
        role: Roles.ADMIN,
    }


    export const postToAdd: PostAdd = {
        owner: "mock_data",
        header: "mock_data",
        body: "mock_data",
        visibility: Visibility.PUBLIC
    }

    export const mPostToUpdate: PostUpdate = {
        header: "mock_data",
        body: "mock_data",
        visibility: Visibility.PUBLIC
    }

    export const mCommentAdd: CommentAdd = {
        owner: "mock_data",
        comment: "mock_data"
    }

}
