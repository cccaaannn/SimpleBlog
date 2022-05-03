// Testing libs
import supertest from 'supertest';

// Mocks
import { MockValues } from '../utils/mocks/const-mock-values';

// Project imports
import MongoDBService from '../../src/core/services/mongodb.service'
import { UserModel } from '../../src/models/UserModel';
import { Token } from '../../src/core/types/Token';
import { User } from '../../src/types/User';
import JWTService from '../../src/core/services/jwt.service';
import app from '../../src/app';
import Roles from '../../src/core/types/enums/Roles';
import Status from '../../src/types/enums/Status';
import EncryptionService from '../../src/core/services/encryption.service';


describe('/api/v1/users', () => {

    // Instantiate supertest
    const request = supertest(app);

    beforeEach(async () => {
        await MongoDBService.connect();
    });

    afterEach(async () => {
        await MongoDBService.disconnect();
    });


    describe('/update', () => {

        test('Successfully updating user details', async () => {
            // Add mock user
            const createdUser: User = await UserModel.create(MockValues.mUserToAddActive);

            // Get admin token
            const token: Token = JWTService.generateToken(MockValues.mTokenPayloadAdmin);


            expect(createdUser.username).not.toEqual(MockValues.mUsername2);
            const comparisonResultBefore: any = await EncryptionService.compare(MockValues.mPassword2, createdUser.password);
            expect(comparisonResultBefore).toEqual(false);


            const res = await request.put(`/api/v1/users/update/${createdUser._id}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token.token}`)
                .send(
                    {
                        "username": MockValues.mUsername2,
                        "password": MockValues.mPassword2
                    }
                );

            expect(res.body.status).toEqual(true);
            expect(res.status).toEqual(200);

            // Is user updated
            const updatedUser: any = await UserModel.findById(createdUser._id);
            console.log(updatedUser);

            expect(updatedUser.username).toEqual(MockValues.mUsername2);

            const comparisonResultAfter: any = await EncryptionService.compare(MockValues.mPassword2, updatedUser.password);
            expect(comparisonResultAfter).toEqual(true);
        });

    });

    describe('/getAll', () => {

        test('Successfully retrieving all users', async () => {
            // Add mock user
            const createdUser: User = await UserModel.create(MockValues.mUserToAddActive);

            // Get admin token
            const token: Token = JWTService.generateToken(MockValues.mTokenPayloadAdmin);

            const res = await request.get('/api/v1/users/getAll')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token.token}`);

            expect(res.body.data.length).toEqual(1);
            expect(res.status).toEqual(200);
        });

    });

    describe('/getById', () => {

        test('Successfully retrieving user by id', async () => {
            // Add mock user
            const createdUser: User = await UserModel.create(MockValues.mUserToAddActive);

            // Get admin token
            const token: Token = JWTService.generateToken(MockValues.mTokenPayloadAdmin);

            const res = await request.get(`/api/v1/users/getById/${createdUser._id}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token.token}`);

            expect(res.body.data._id).toEqual(createdUser._id.toString());
            expect(res.status).toEqual(200);
        });

    });

    describe('/changeRole', () => {

        test('Successfully changing users role from USER to ADMIN', async () => {
            // Add mock user
            const createdUser: User = await UserModel.create(MockValues.mUserToAddActive);

            // Get admin token
            const token: Token = JWTService.generateToken(MockValues.mTokenPayloadAdmin);

            const res = await request.put(`/api/v1/users/changeRole/${createdUser._id}/${Roles.ADMIN}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token.token}`);

            expect(res.body.status).toEqual(true);
            expect(res.status).toEqual(200);

            // Is user updated
            const updatedUser: any = await UserModel.findById(createdUser._id);
            expect(updatedUser.role).toEqual(Roles.ADMIN);
        });

    });

    describe('/activate', () => {

        test('Successfully changing users status to active', async () => {
            // Add mock user
            const createdUser: User = await UserModel.create(MockValues.mUserToAddSuspended);

            // Get admin token
            const token: Token = JWTService.generateToken(MockValues.mTokenPayloadAdmin);

            expect(createdUser.status).toEqual(Status.SUSPENDED);

            const res = await request.put(`/api/v1/users/activate/${createdUser._id}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token.token}`);

            expect(res.body.status).toEqual(true);
            expect(res.status).toEqual(200);

            // Is user updated
            const updatedUser: any = await UserModel.findById(createdUser._id);
            expect(updatedUser.status).toEqual(Status.ACTIVE);
        });

    });

    describe('/suspend', () => {

        test('Successfully changing users status to suspended', async () => {
            // Add mock user
            const createdUser: User = await UserModel.create(MockValues.mUserToAddActive);

            // Get admin token
            const token: Token = JWTService.generateToken(MockValues.mTokenPayloadAdmin);

            expect(createdUser.status).toEqual(Status.ACTIVE);

            const res = await request.put(`/api/v1/users/suspend/${createdUser._id}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token.token}`);

            expect(res.body.status).toEqual(true);
            expect(res.status).toEqual(200);

            // Is user updated
            const updatedUser: any = await UserModel.findById(createdUser._id);
            expect(updatedUser.status).toEqual(Status.SUSPENDED);
        });

    });

    describe('/delete', () => {

        test('Successfully changing users status to deleted', async () => {
            // Add mock user
            const createdUser: User = await UserModel.create(MockValues.mUserToAddActive);

            // Get admin token
            const token: Token = JWTService.generateToken(MockValues.mTokenPayloadAdmin);

            expect(createdUser.status).toEqual(Status.ACTIVE);

            const res = await request.delete(`/api/v1/users/delete/${createdUser._id}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token.token}`);

            expect(res.body.status).toEqual(true);
            expect(res.status).toEqual(200);

            // Is user updated
            const updatedUser: any = await UserModel.findById(createdUser._id);
            expect(updatedUser.status).toEqual(Status.DELETED);
        });

    });

    describe('/purge', () => {

        test('Successfully purging the user', async () => {
            // Add mock user
            const createdUser: User = await UserModel.create(MockValues.mUserToAddActive);

            // Get admin token
            const token: Token = JWTService.generateToken(MockValues.mTokenPayloadAdmin);

            expect(createdUser.status).toEqual(Status.ACTIVE);

            const res = await request.delete(`/api/v1/users/purge/${createdUser._id}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token.token}`);

            expect(res.body.status).toEqual(true);
            expect(res.status).toEqual(200);

            // Is user purged
            const updatedUser: any = await UserModel.findById(createdUser._id);
            expect(updatedUser).toBe(null);
        });

    });

});