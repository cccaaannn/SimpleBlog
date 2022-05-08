import Visibility from "../../../src/types/enums/Visibility";
import Roles from "../../../src/core/types/enums/Roles";
import Status from "../../../src/core/types/enums/Status";

import { ErrorDataResult, SuccessDataResult } from "../../../src/core/results/DataResult";
import { ErrorResult, IResult, SuccessResult } from "../../../src/core/results/Result";
import { Post, PostAdd, PostSort, PostUpdate } from "../../../src/types/Post";
import { User, UserAdd, UserSort, UserUpdate } from "../../../src/types/User";
import { TokenPayload } from '../../../src/core/types/TokenPayload';
import { CommentAdd } from "../../../src/types/Comment";
import { SignUp } from "../../../src/core/types/SignUp";
import { Login } from "../../../src/core/types/Login";
import { Token } from "../../../src/core/types/Token";
import TokenType from "../../../src/core/types/enums/TokenType";
import Category from "../../../src/types/enums/Category";


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

    export const mPostHeader1 = "header1";
    export const mPostHeader2 = "header2";
    export const mPostHeader3 = "header3";

    export const mPostBody1 = "body1";
    export const mPostBody2 = "body2";
    export const mPostBody3 = "body3";

    export const mImage1 = "image1";
    export const mImage2 = "image2";
    export const mImage3 = "image3";

    export const mComment1 = "comment1";
    export const mComment2 = "comment2";
    export const mComment3 = "comment3";


    export const mDateNow = new Date();

    export const mTokenPayloadUser1: TokenPayload = {
        id: mUserId1,
        status: Status.ACTIVE,
        username: mUsername1,
        email: mEmail1,
        role: Roles.USER,
        type: TokenType.AUTH
    }

    export const mTokenPayloadUser2: TokenPayload = {
        id: mUserId2,
        status: Status.ACTIVE,
        username: mUsername2,
        email: mEmail2,
        role: Roles.USER,
        type: TokenType.AUTH
    }

    export const mTokenPayloadVerifyUser1: TokenPayload = {
        id: mUserId1,
        status: Status.ACTIVE,
        username: mUsername1,
        email: mEmail1,
        role: Roles.USER,
        type: TokenType.VERIFY
    }
    
    export const mTokenPayloadResetUser1: TokenPayload = {
        id: mUserId1,
        status: Status.ACTIVE,
        username: mUsername1,
        email: mEmail1,
        role: Roles.USER,
        type: TokenType.RESET
    }

    export const mTokenPayloadAdmin: TokenPayload = {
        id: mUserId2,
        status: Status.ACTIVE,
        username: mUsername1,
        email: mEmail1,
        role: Roles.ADMIN,
        type: TokenType.AUTH
    }

    // ---------- ---------- ---------- ---------- ----------


    // ---------- ---------- Posts ---------- ---------- 

    export const mPostsFull: Post[] = [
        {
            _id: mPostId1,
            owner: mUserId1,
            header: mPostHeader1,
            body: mPostBody1,
            image: mImage1,
            category: Category.GENERAL,
            visibility: Visibility.PUBLIC,
            comments: [
                {
                    _id: mCommentId1,
                    owner: mUserId1,
                    comment: mComment1,
                    dateCreated: mDateNow
                }
            ],
            dateCreated: mDateNow
        },
        {
            _id: mPostId2,
            owner: mUserId2,
            header: mPostHeader2,
            body: mPostBody2,
            image: mImage1,
            category: Category.GENERAL,
            visibility: Visibility.PUBLIC,
            comments: [
                {
                    _id: mCommentId2,
                    owner: mUserId2,
                    comment: mComment2,
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
        header: mPostHeader1,
        body: mPostBody1,
        image: mImage1,
        category: Category.GENERAL,
        visibility: Visibility.PUBLIC,
        comments: [
            {
                _id: mCommentId1,
                owner: mUserId1,
                comment: mComment1,
                dateCreated: mDateNow
            }
        ],
        dateCreated: mDateNow
    }

    export const mPostMember: Post = {
        _id: mPostId1,
        owner: mUserId1,
        header: mPostHeader1,
        body: mPostBody1,
        image: mImage1,
        category: Category.GENERAL,
        visibility: Visibility.MEMBERS,
        comments: [
            {
                _id: mCommentId1,
                owner: mUserId1,
                comment: mComment1,
                dateCreated: mDateNow
            }
        ],
        dateCreated: mDateNow
    }
    
    export const mPostPrivate: Post = {
        _id: mPostId1,
        owner: mUserId1,
        header: mPostHeader1,
        body: mPostBody1,
        image: mImage1,
        category: Category.GENERAL,
        visibility: Visibility.PRIVATE,
        comments: [
            {
                _id: mCommentId1,
                owner: mUserId1,
                comment: mComment1,
                dateCreated: mDateNow
            }
        ],
        dateCreated: mDateNow
    }

    export const mPostToAdd: PostAdd = {
        owner: mUserId1,
        header: mPostHeader1,
        body: mPostBody1,
        image: mImage1,
        category: Category.GENERAL,
        visibility: Visibility.PUBLIC
    }

    export const mPostToAddMembers: PostAdd = {
        owner: mUserId1,
        header: mPostHeader1,
        body: mPostBody1,
        image: mImage1,
        category: Category.GENERAL,
        visibility: Visibility.MEMBERS
    }

    export const mPostToAddPrivate: PostAdd = {
        owner: mUserId1,
        header: mPostHeader1,
        body: mPostBody1,
        image: mImage1,
        category: Category.GENERAL,
        visibility: Visibility.PRIVATE
    }

    export const mPostToAddWrongValidations: any = {
        owner: mUserId1,
        header: mPostHeader1,
        body: mPostBody1,
        image: mImage1,
        category: Category.ALL, // Posts can not have all category type
        visibility: "mock"      // Posts can not have wrong visibility option 
    }

    export const mPostToAddWithComment1: any = {
        owner: mUserId1,
        header: mPostHeader1,
        body: mPostBody1,
        image: mImage1,
        category: Category.GENERAL,
        visibility: Visibility.PUBLIC,
        comments: [
            { comment: mComment1 }
        ]
    }

    export const mPostToUpdate: PostUpdate = {
        header: mPostHeader1,
        body: mPostBody1,
        image: mImage1,
        visibility: Visibility.PUBLIC
    }

    export const mPostToUpdate2: PostUpdate = {
        header: mPostHeader2,
        body: mPostBody2,
        image: mImage2,
        visibility: Visibility.PUBLIC
    }

    export const mCommentAdd: CommentAdd = {
        owner: mUserId1,
        comment: mComment1
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

    export const mUserToAddAdmin: any = {
        username: mUsername1,
        email: mEmail1,
        password: mPassword1,
        status: Status.ACTIVE,
        role: Roles.ADMIN
    }

    export const mUserToAddActive: any = {
        username: mUsername1,
        email: mEmail1,
        password: mPassword1,
        status: Status.ACTIVE
    }

    export const mUserToAddSuspended: any = {
        username: mUsername1,
        email: mEmail1,
        password: mPassword1,
        status: Status.SUSPENDED
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

    export const mSuccessDataResultTokenPayloadVerifyUser1: SuccessDataResult<TokenPayload> = {
        data: mTokenPayloadVerifyUser1,
        status: true
    }

    export const mSuccessDataResultTokenPayloadResetUser1: SuccessDataResult<TokenPayload> = {
        data: mTokenPayloadResetUser1,
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

    export const mSuccessDataResultPost1: SuccessDataResult<Post> = {
        data: mPost1,
        status: true
    }

    export const mSuccessDataResultPostMember: SuccessDataResult<Post> = {
        data: mPostMember,
        status: true
    }

    export const mSuccessDataResultPostPrivate: SuccessDataResult<Post> = {
        data: mPostPrivate,
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


    // ---------- ---------- Other ---------- ----------

    export const mUnstripedBody1: any = {
        key1: "  value1  ",
        key2: "  value2  "
    }

    export const mStripedBody1: any = {
        key1: "value1",
        key2: "value2"
    }

    // ---------- ---------- ---------- ---------- ----------

}
