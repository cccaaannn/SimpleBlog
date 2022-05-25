// Testing libs
import supertest from 'supertest';

// Mocks
import { MockValues } from '../utils/mocks/const-mock-values';

// Project imports
import MongoDBService from '../../src/core/services/mongodb.service';
import JWTService from '../../src/core/services/jwt.service';
import Visibility from '../../src/types/enums/Visibility';
import app from '../../src/app';

import { PostModel } from '../../src/models/PostModel';
import { UserModel } from '../../src/models/UserModel';
import { Token } from '../../src/core/types/Token';
import { User } from '../../src/types/User';
import { Post } from '../../src/types/Post';
import Category from '../../src/types/enums/Category';


describe('/api/v1/posts', () => {

    // Instantiate supertest
    const request = supertest(app);

    beforeEach(async () => {
        await MongoDBService.connect();
    });

    afterEach(async () => {
        await MongoDBService.disconnect();
    });


    describe('/getAll', () => {

        test('Successfully retrieving all posts', async () => {
            // Add mock user
            const createdUser: User = await UserModel.create(MockValues.mUserToAddActive);

            // Add mock post
            const postToAdd: any = { ...MockValues.mPostToAdd }
            postToAdd.owner = createdUser._id;
            const createdPost: Post = await PostModel.create(postToAdd);

            // Get admin token
            const token: Token = JWTService.generateToken(MockValues.mTokenPayloadAdmin);

            const res = await request.get('/api/v1/posts/getAll')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token.token}`);

            expect(res.body.data.data.length).toEqual(1);
            expect(res.status).toEqual(200);
        });

    });

    describe('/getByUserId', () => {

        test('Successfully retrieving all posts of a user by id', async () => {
            // Add mock user
            const createdUser: User = await UserModel.create(MockValues.mUserToAddActive);
            const createdUser2: User = await UserModel.create(MockValues.mUserToAddActive);

            // Add mock post
            const postToAdd: any = { ...MockValues.mPostToAdd }
            postToAdd.owner = createdUser._id;
            await PostModel.create(postToAdd);

            const postToAdd2: any = { ...MockValues.mPostToAdd }
            postToAdd2.owner = createdUser2._id;
            await PostModel.create(postToAdd2);

            // Get admin token
            const token: Token = JWTService.generateToken(MockValues.mTokenPayloadAdmin);

            const res = await request.get(`/api/v1/posts/getByUserId/${createdUser._id}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token.token}`);

            expect(res.body.data.data.length).toEqual(1);
            expect(res.body.data.data[0].owner._id).toEqual(createdUser._id.toString());
            expect(res.body.data.data[0].owner._id).not.toEqual(createdUser2._id.toString());
            expect(res.status).toEqual(200);
        });

    });

    describe('/getById', () => {

        test('Successfully retrieving posts by its id', async () => {
            // Add mock user
            const createdUser: User = await UserModel.create(MockValues.mUserToAddActive);

            // Add mock post
            const postToAdd: any = { ...MockValues.mPostToAdd }
            postToAdd.owner = createdUser._id;
            const createdPost: Post = await PostModel.create(postToAdd);

            // Get admin token
            const token: Token = JWTService.generateToken(MockValues.mTokenPayloadAdmin);

            const res = await request.get(`/api/v1/posts/getById/${createdPost._id}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token.token}`);

            expect(res.body.data._id).toEqual(createdPost._id.toString());
            expect(res.body.data.owner._id).toEqual(createdUser._id.toString());
            expect(res.status).toEqual(200);
        });

    });

    describe('/add', () => {

        test('Successfully adding a post', async () => {
            // Add mock user
            const createdUserAdmin: User = await UserModel.create(MockValues.mUserToAddAdmin);

            // Get admin token
            const tokenPayloadAdmin = { ...MockValues.mTokenPayloadAdmin };
            tokenPayloadAdmin.id = createdUserAdmin._id.toString();

            const token: Token = JWTService.generateToken(tokenPayloadAdmin);

            const res = await request.post('/api/v1/posts/add')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token.token}`)
                .send(
                    {
                        "header": MockValues.mPostHeader1,
                        "body": MockValues.mPostBody1,
                        "image": MockValues.mImage1,
                        "category": Category.GENERAL,
                        "visibility": Visibility.PUBLIC
                    }
                );

            expect(res.body.status).toEqual(true);
            expect(res.status).toEqual(200);

            const posts: any = await PostModel.find();
            expect(posts.length).toEqual(1);
            expect(posts[0].owner.toString()).toEqual(createdUserAdmin._id.toString());
            expect(posts[0].header).toEqual(MockValues.mPostHeader1);
            expect(posts[0].body).toEqual(MockValues.mPostBody1);
        });

    });

    describe('/update', () => {

        test('Successfully updating a post by id', async () => {
            // Add mock user
            const createdUser: User = await UserModel.create(MockValues.mUserToAddActive);
            const createdUserAdmin: User = await UserModel.create(MockValues.mUserToAddAdmin);

            // Add mock post to regular user
            const postToAdd: any = { ...MockValues.mPostToAdd }
            postToAdd.owner = createdUser._id;
            const createdPost: Post = await PostModel.create(postToAdd);

            // Check post before update
            const posts: any = await PostModel.find();
            expect(posts.length).toEqual(1);
            expect(posts[0].owner.toString()).toEqual(createdUser._id.toString());
            expect(posts[0].header).toEqual(MockValues.mPostHeader1);
            expect(posts[0].body).toEqual(MockValues.mPostBody1);

            // Get admin token with real id
            const tokenPayloadAdmin = { ...MockValues.mTokenPayloadAdmin };
            tokenPayloadAdmin.id = createdUserAdmin._id.toString();

            const token: Token = JWTService.generateToken(tokenPayloadAdmin);

            const res = await request.put(`/api/v1/posts/update/${createdPost._id.toString()}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token.token}`)
                .send(
                    {
                        "header": MockValues.mPostHeader2,
                        "body": MockValues.mPostBody2,
                        "image": MockValues.mImage1,
                        "visibility": Visibility.PUBLIC
                    }
                );

            expect(res.body.status).toEqual(true);
            expect(res.status).toEqual(200);

            const postsUpdated: any = await PostModel.find();
            expect(postsUpdated.length).toEqual(1);
            expect(postsUpdated[0].owner.toString()).toEqual(createdUser._id.toString());
            expect(postsUpdated[0].header).toEqual(MockValues.mPostHeader2);
            expect(postsUpdated[0].body).toEqual(MockValues.mPostBody2);
        });

    });

    describe('/delete', () => {

        test('Successfully deleting a post by id', async () => {
            // Add mock user
            const createdUser: User = await UserModel.create(MockValues.mUserToAddActive);
            const createdUserAdmin: User = await UserModel.create(MockValues.mUserToAddAdmin);

            // Add mock post to regular user
            const postToAdd: any = { ...MockValues.mPostToAdd }
            postToAdd.owner = createdUser._id;
            const createdPost: Post = await PostModel.create(postToAdd);

            // Check post before update
            const posts: any = await PostModel.find();
            expect(posts.length).toEqual(1);

            // Get admin token with real id
            const tokenPayloadAdmin = { ...MockValues.mTokenPayloadAdmin };
            tokenPayloadAdmin.id = createdUserAdmin._id.toString();

            const token: Token = JWTService.generateToken(tokenPayloadAdmin);

            const res = await request.delete(`/api/v1/posts/delete/${createdPost._id.toString()}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token.token}`);

            expect(res.body.status).toEqual(true);
            expect(res.status).toEqual(200);

            const postsDeleted: any = await PostModel.find();
            expect(postsDeleted.length).toEqual(0);
        });

    });

    describe('/addComment', () => {

        test('Successfully adding a comment to a post by post id', async () => {
            // Add mock user
            const createdUser: User = await UserModel.create(MockValues.mUserToAddActive);
            const createdUserAdmin: User = await UserModel.create(MockValues.mUserToAddAdmin);

            // Add mock post to regular user
            const postToAdd: any = { ...MockValues.mPostToAdd }
            postToAdd.owner = createdUser._id;
            const createdPost: Post = await PostModel.create(postToAdd);

            // Check post before update
            const posts: any = await PostModel.find();
            expect(posts.length).toEqual(1);

            // Get admin token with real id
            const tokenPayloadAdmin = { ...MockValues.mTokenPayloadAdmin };
            tokenPayloadAdmin.id = createdUserAdmin._id.toString();

            const token: Token = JWTService.generateToken(tokenPayloadAdmin);

            const res = await request.put(`/api/v1/posts/addComment/${createdPost._id.toString()}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token.token}`)
                .send(
                    {
                        "comment": MockValues.mComment1
                    }
                );
            
            expect(res.body.status).toEqual(true);
            expect(res.status).toEqual(200);

            const postsUpdated: any = await PostModel.find();
            expect(postsUpdated.length).toEqual(1);
            expect(postsUpdated[0].comments.length).toEqual(1);
            expect(postsUpdated[0].comments[0].comment).toEqual(MockValues.mComment1);

            // Since token is belong to admin, owner of the comment will be admin too
            expect(postsUpdated[0].comments[0].owner.toString()).toEqual(createdUserAdmin._id.toString()); 

        });

    });

    describe('/removeComment', () => {

        test('Successfully deleting a comment from a post by post id and comment id', async () => {
            // Add mock user
            const createdUser: User = await UserModel.create(MockValues.mUserToAddActive);
            const createdUserAdmin: User = await UserModel.create(MockValues.mUserToAddAdmin);

            // Add mock post to regular user
            const postToAdd: any = { ...MockValues.mPostToAddWithComment1 }
            postToAdd.owner = createdUser._id;
            const createdPost: Post = await PostModel.create(postToAdd);

            // Check post before update
            const posts: any = await PostModel.find();
            expect(posts.length).toEqual(1);
            expect(posts[0].comments.length).toEqual(1);

            // Get admin token with real id
            const tokenPayloadAdmin = { ...MockValues.mTokenPayloadAdmin };
            tokenPayloadAdmin.id = createdUserAdmin._id.toString();

            const token: Token = JWTService.generateToken(tokenPayloadAdmin);

            const res = await request.put(`/api/v1/posts/removeComment/${createdPost._id.toString()}/${createdPost.comments[0]._id.toString()}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token.token}`);
            
            expect(res.body.status).toEqual(true);
            expect(res.status).toEqual(200);

            const postsUpdated: any = await PostModel.find();
            expect(postsUpdated.length).toEqual(1);
            expect(postsUpdated[0].comments.length).toEqual(0);
        });

    });

});