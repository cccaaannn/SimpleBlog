// Testing libs
import supertest from 'supertest';

// Mocks
import { MockValues } from '../utils/mocks/const-mock-values';

// Project imports
import EmailAuthService from '../../src/services/email-auth.service';
import EncryptionService from '../../src/core/services/encryption.service';
import MongoDBService from '../../src/core/services/mongodb.service'
import JWTService from '../../src/core/services/jwt.service';
import Status from '../../src/core/types/enums/Status';
import app from '../../src/app';

import { TokenPayload } from '../../src/core/types/TokenPayload';
import { SuccessResult } from '../../src/core/results/Result';
import { UserModel } from '../../src/models/UserModel';
import { User, UserAdd } from '../../src/types/User';
import { Token } from '../../src/core/types/Token';
import RecaptchaService from '../../src/core/services/recaptcha.service';


// Special mock case, EmailService is a class that is instantiated inside the email-verification.service
jest.mock('../../src/core/services/email.service', () => {
    return {
        EmailService: jest.fn().mockImplementation(() => {
            return {
                send: async function () {
                    return new SuccessResult();
                }
            }
        })
    }
})

describe('/api/v1/auth', () => {

    // Instantiate supertest
    const request = supertest(app);

    beforeEach(async () => {
        await MongoDBService.connect();
    });

    afterEach(async () => {
        await MongoDBService.disconnect();
    });


    describe('/login', () => {

        test('Successful login', async () => {
            jest.spyOn(RecaptchaService, 'verify').mockResolvedValueOnce(MockValues.mSuccessResult);

            // Add mock user
            const mUserToAdd: User = { ...MockValues.mUserToAddActive }
            mUserToAdd.password = await EncryptionService.hash(MockValues.mUserToAddActive.password);
            const createdUser: User = await UserModel.create(mUserToAdd);

            const res = await request.post(`/api/v1/auth/login`)
                .set('Accept', 'application/json')
                .set('Authorization', ``)
                .send(
                    {
                        "username": MockValues.mUsername1,
                        "password": MockValues.mPassword1
                    }
                );

            expect(res.body.status).toEqual(true);
            expect(res.status).toEqual(200);

            const token: Token = { token: res.body.data.token }
            const tokenPayload: any = await (await JWTService.verify(token)).data;
            expect(tokenPayload).not.toBe(null);
            expect(tokenPayload.id).toEqual(createdUser._id.toString());
        });

    });

    describe('/signUp', () => {

        test('Successful signUp', async () => {
            jest.spyOn(RecaptchaService, 'verify').mockResolvedValueOnce(MockValues.mSuccessResult);
            jest.spyOn(EmailAuthService, "sendAccountVerificationEmail").mockResolvedValueOnce(MockValues.mSuccessResult);

            const res = await request.post(`/api/v1/auth/signUp`)
                .set('Accept', 'application/json')
                .set('Authorization', ``)
                .send(
                    {
                        "email": MockValues.mEmail1,
                        "username": MockValues.mUsername1,
                        "password": MockValues.mPassword1
                    }
                );

            expect(res.body.status).toEqual(true);
            expect(res.status).toEqual(200);

            const users: any = await UserModel.find();
            expect(users.length).toEqual(1);
            expect(users[0].email).toEqual(MockValues.mEmail1);
            expect(users[0].username).toEqual(MockValues.mUsername1);
            expect(users[0].status).toEqual(Status.PASSIVE);

            const comparisonResultAfter: any = await EncryptionService.compare(MockValues.mPassword1, users[0].password);
            expect(comparisonResultAfter).toEqual(true);
        });

    });

    describe('/sendAccountVerification', () => {

        test('Successfully sending email verification', async () => {
            // sendAccountVerificationEmail is not await'ed inside sendVerification, jest closes db connection before sendAccountVerificationEmail begins. This has to be mocked.
            jest.spyOn(EmailAuthService, "sendAccountVerificationEmail").mockResolvedValueOnce(MockValues.mSuccessResult);

            // Add mock user
            const mUserToAdd: UserAdd = { ...MockValues.mUserToAdd }
            await UserModel.create(mUserToAdd);

            const res = await request.get(`/api/v1/auth/sendAccountVerification/${MockValues.mEmail1}`)
                .set('Accept', 'application/json')
                .set('Authorization', ``);

            expect(res.body.status).toEqual(true);
            expect(res.status).toEqual(200);
        });

    });

    describe('/verifyAccount', () => {

        test('Successful user verification', async () => {
            // Add mock user
            const mUserToAdd: UserAdd = { ...MockValues.mUserToAdd }
            const createdUser: User = await UserModel.create(mUserToAdd);

            expect(createdUser.status).toEqual(Status.PASSIVE);

            // Generate activation token for mock created user
            const tokenPayload: TokenPayload = { ...MockValues.mTokenPayloadVerifyUser1 }
            tokenPayload.id = createdUser._id.toString();
            const token: Token = JWTService.generateToken(tokenPayload, process.env.JWT_EMAIL_VERIFICATION_TOKEN_EXPIRATION)

            const res = await request.post(`/api/v1/auth/verifyAccount`)
                .set('Accept', 'application/json')
                .set('Authorization', ``)
                .send(
                    {
                        "token": token.token
                    }
                );

            expect(res.body.status).toEqual(true);
            expect(res.status).toEqual(200);

            const activatedUser: any = await UserModel.findById(createdUser._id);
            expect(activatedUser.status).toEqual(Status.ACTIVE);
        });

    });

    describe('/sendPasswordReset', () => {

        test('Successfully sending password reset email', async () => {
            // sendAccountVerificationEmail is not await'ed inside sendVerification, jest closes db connection before sendAccountVerificationEmail begins. This has to be mocked.
            jest.spyOn(EmailAuthService, "sendPasswordResetEmail").mockResolvedValueOnce(MockValues.mSuccessResult);

            // Add mock user
            const mUserToAdd: UserAdd = { ...MockValues.mUserToAddActive }
            await UserModel.create(mUserToAdd);

            const res = await request.get(`/api/v1/auth/sendPasswordReset/${MockValues.mEmail1}`)
                .set('Accept', 'application/json')
                .set('Authorization', ``);

            expect(res.body.status).toEqual(true);
            expect(res.status).toEqual(200);
        });

    });

    describe('/resetPassword', () => {

        test('Successful password reset', async () => {
            // Add mock user
            const mUserToAdd: UserAdd = { ...MockValues.mUserToAddActive }
            const createdUser: User = await UserModel.create(mUserToAdd);

            // Password is not encrypted, since user added without service
            expect(createdUser.password).toEqual(MockValues.mPassword1);

            // Generate activation token for mock created user
            const tokenPayload: TokenPayload = { ...MockValues.mTokenPayloadResetUser1 }
            tokenPayload.id = createdUser._id.toString();
            const token: Token = JWTService.generateToken(tokenPayload, process.env.JWT_EMAIL_VERIFICATION_TOKEN_EXPIRATION)

            const res = await request.post(`/api/v1/auth/resetPassword`)
                .set('Accept', 'application/json')
                .set('Authorization', ``)
                .send(
                    {
                        "token": token.token,
                        "password": MockValues.mPassword2
                    }
                );

            expect(res.body.status).toEqual(true);
            expect(res.status).toEqual(200);

            // Comparison for new password
            const updatedUser: any = await UserModel.findById(createdUser._id);
            const comparisonResultAfter: any = await EncryptionService.compare(MockValues.mPassword2, updatedUser.password);
            expect(comparisonResultAfter).toEqual(true);

        });

    });

});