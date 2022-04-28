import Visibility from "../../../src/types/enums/Visibility";
import Roles from "../../../src/core/types/enums/Roles";
import Status from "../../../src/types/enums/Status";

import { Post, PostAdd, PostSort, PostUpdate } from "../../../src/types/Post";
import { User, UserAdd, UserSort, UserUpdate } from "../../../src/types/User";
import { ErrorDataResult, SuccessDataResult } from "../../../src/core/results/DataResult";
import { ErrorResult, IResult, SuccessResult } from "../../../src/core/results/Result";
import { TokenPayload } from '../../../src/core/types/TokenPayload';
import { CommentAdd } from "../../../src/types/Comment";
import { SignUp } from "../../../src/core/types/SignUp";
import { Login } from "../../../src/core/types/Login";
import { Token } from "../../../src/core/types/Token";


export namespace MockValues {

    // ---------- ---------- General ---------- ---------- 

    export const mUserId1 = "user1";
    export const mUserId2 = "user2";
    export const mUserId3 = "user3";

    export const mUsername1 = "username1";
    export const mUsername2 = "username2";
    export const mUsername3 = "username3";

    export const mEmail1 = "email1";
    export const mEmail2 = "email2";
    export const mEmail3 = "email3";

    export const mPassword1 = "password1";
    export const mPassword2 = "password2";
    export const mPassword3 = "password3";

    export const mPostId1 = "post1";
    export const mPostId2 = "post2";
    export const mPostId3 = "post3";

    export const mCommentId1 = "comment1";
    export const mCommentId2 = "comment2";
    export const mCommentId3 = "comment3";

    export const mDateNow = new Date();

    export const mTokenPayloadUser1: TokenPayload = {
        id: mUserId1,
        status: Status.ACTIVE,
        username: mUsername1,
        email: mEmail1,
        role: Roles.USER
    }

    export const mTokenPayloadAdmin: TokenPayload = {
        id: mUserId2,
        status: Status.ACTIVE,
        username: mUsername1,
        email: mEmail1,
        role: Roles.ADMIN,
    }

    // ---------- ---------- ---------- ---------- ----------


    // ---------- ---------- Posts ---------- ---------- 

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
                    owner: mUserId1,
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
                    owner: mUserId2,
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
                owner: mUserId1,
                comment: "mock_data",
                dateCreated: mDateNow
            }
        ],
        dateCreated: mDateNow
    }

    export const mPostToAdd: PostAdd = {
        owner: mUserId1,
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

    export const mPostSort: PostSort = {
        visibility: 1
    }

    export const mPostSorter: any = {
        sort: function () {
            return mPostsFull
        }
    }

    // ---------- ---------- ---------- ---------- ----------


    // ---------- ---------- Users ---------- ----------

    export const mUsersFull: User[] = [
        {
            _id: mUserId1,
            status: Status.ACTIVE,
            username: mUsername1,
            email: mEmail1,
            password: mPassword1,
            role: Roles.USER,
            dateCreated: mDateNow
        }
    ]

    export const mUser1: User = {
        _id: mUserId1,
        status: Status.ACTIVE,
        username: mUsername1,
        email: mEmail1,
        password: mPassword1,
        role: Roles.USER,
        dateCreated: mDateNow
    }

    export const mUser1Deleted: User = {
        _id: mUserId1,
        status: Status.DELETED,
        username: mUsername1,
        email: mEmail1,
        password: mPassword1,
        role: Roles.USER,
        dateCreated: mDateNow
    }

    export const mUser1Passive: User = {
        _id: mUserId1,
        status: Status.PASSIVE,
        username: mUsername1,
        email: mEmail1,
        password: mPassword1,
        role: Roles.USER,
        dateCreated: mDateNow
    }

    export const mUser1Suspended: User = {
        _id: mUserId1,
        status: Status.SUSPENDED,
        username: mUsername1,
        email: mEmail1,
        password: mPassword1,
        role: Roles.USER,
        dateCreated: mDateNow
    }

    export const mUserAdmin: User = {
        _id: mUserId1,
        status: Status.ACTIVE,
        username: mUsername1,
        email: mEmail1,
        password: mPassword1,
        role: Roles.ADMIN,
        dateCreated: mDateNow
    }

    export const mUsersEmpty: User[] = []

    export const mUserToAdd: UserAdd = {
        username: mUsername1,
        email: mEmail1,
        password: mPassword1
    }

    export const mUserToUpdate: UserUpdate = {
        username: mUsername1
    }

    export const mUserToUpdateWithPassword: UserUpdate = {
        username: mUsername1,
        password: mPassword1
    }

    export const mUserSort: UserSort = {
        username: 1
    }

    export const mUsersSorter: any = {
        sort: function () {
            return mUsersFull
        }
    }

    // ---------- ---------- ---------- ---------- ----------


    // ---------- ---------- Email verification ---------- ----------

    export const mTemplate1: string = "template1";

    export const mEmailService: any = {
        send: async function (): Promise<IResult> {
            return new Promise<IResult>((resolve, reject) => {
                resolve(new SuccessResult());
            });
        }
    }

    // ---------- ---------- ---------- ---------- ----------


    // ---------- ---------- Auth ---------- ----------

    export const mLoginUser1: Login = {
        username: mUsername1,
        password: mPassword1
    };

    export const mSignUp1: SignUp = {
        username: mUsername1,
        email: mEmail1,
        password: mPassword1
    }

    export const mToken1: Token = {
        token: "token1"
    };

    export const mToken2: Token = {
        token: "token2"
    };

    // ---------- ---------- ---------- ---------- ----------


    // ---------- ---------- Results ---------- ----------

    export const mSuccessResult: SuccessResult = {
        status: true
    }

    export const mErrorResult: ErrorResult = {
        status: false
    }

    export const mSuccessDataResultTokenPayloadUser1: SuccessDataResult<TokenPayload> = {
        data: mTokenPayloadUser1,
        status: true
    }

    export const mSuccessDataResultToken1: SuccessDataResult<Token> = {
        data: mToken1,
        status: true
    }

    export const mSuccessDataResultUsersFull: SuccessDataResult<User[]> = {
        data: mUsersFull,
        status: true
    }

    export const mSuccessDataResultUsersEmpty: SuccessDataResult<User[]> = {
        data: mUsersEmpty,
        status: true
    }

    export const mSuccessDataResultPostsFull: SuccessDataResult<Post[]> = {
        data: mPostsFull,
        status: true
    }

    export const mSuccessDataResultPostsEmpty: SuccessDataResult<Post[]> = {
        data: mPostsEmpty,
        status: true
    }

    export const mSuccessDataResultUser1: SuccessDataResult<User> = {
        data: mUser1,
        status: true
    }

    export const mSuccessDataResultUser1Deleted: SuccessDataResult<User> = {
        data: mUser1Deleted,
        status: true
    }

    export const mSuccessDataResultUser1Passive: SuccessDataResult<User> = {
        data: mUser1Passive,
        status: true
    }

    export const mSuccessDataResultUser1Suspended: SuccessDataResult<User> = {
        data: mUser1Suspended,
        status: true
    }

    export const mSuccessDataResultUser1Active: SuccessDataResult<User> = {
        data: mUser1,
        status: true
    }

    export const mErrorDataResult: ErrorDataResult<null> = {
        data: null,
        status: false
    }

    // ---------- ---------- ---------- ---------- ----------

}