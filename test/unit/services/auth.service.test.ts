import EmailAuthService from "../../../src/services/email-auth.service";
import EncryptionService from "../../../src/core/services/encryption.service";
import JWTService from "../../../src/core/services/jwt.service";
import UserService from "../../../src/services/user.service";
import AuthService from "../../../src/services/auth.service";

import { ErrorDataResult, SuccessDataResult } from "../../../src/core/results/DataResult";
import { ErrorResult, SuccessResult } from "../../../src/core/results/Result";
import { MockValues } from "../../utils/mocks/const-mock-values";
import RecaptchaService from "../../../src/core/services/recaptcha.service";


describe('Auth service', () => {

    describe('login', () => {

        test('Incorrect captcha', async () => {
            jest.spyOn(RecaptchaService, 'verify').mockResolvedValueOnce(MockValues.mErrorResult);

            const result = await AuthService.login(MockValues.mLoginUser1);

            expect(RecaptchaService.verify).toBeCalled();
            expect(RecaptchaService.verify).toBeCalledWith(MockValues.mCaptcha1);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorDataResult);
        });

        test('Not existing user', async () => {
            jest.spyOn(RecaptchaService, 'verify').mockResolvedValueOnce(MockValues.mSuccessResult);
            jest.spyOn(UserService, 'getByUsername').mockResolvedValueOnce(MockValues.mErrorDataResult);

            const result = await AuthService.login(MockValues.mLoginUser1);

            expect(RecaptchaService.verify).toBeCalled();
            expect(RecaptchaService.verify).toBeCalledWith(MockValues.mCaptcha1);
            expect(UserService.getByUsername).toBeCalled();
            expect(UserService.getByUsername).toBeCalledWith(MockValues.mLoginUser1.username);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorDataResult);
        });

        test('Deleted user', async () => {
            jest.spyOn(RecaptchaService, 'verify').mockResolvedValueOnce(MockValues.mSuccessResult);
            jest.spyOn(UserService, 'getByUsername').mockResolvedValueOnce(MockValues.mSuccessDataResultUser1Deleted);

            const result = await AuthService.login(MockValues.mLoginUser1);

            expect(RecaptchaService.verify).toBeCalled();
            expect(RecaptchaService.verify).toBeCalledWith(MockValues.mCaptcha1);
            expect(UserService.getByUsername).toBeCalled();
            expect(UserService.getByUsername).toBeCalledWith(MockValues.mLoginUser1.username);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorDataResult);
        });

        test('Inactive user', async () => {
            jest.spyOn(RecaptchaService, 'verify').mockResolvedValueOnce(MockValues.mSuccessResult);
            jest.spyOn(UserService, 'getByUsername').mockResolvedValueOnce(MockValues.mSuccessDataResultUser1Passive);

            const result = await AuthService.login(MockValues.mLoginUser1);

            expect(RecaptchaService.verify).toBeCalled();
            expect(RecaptchaService.verify).toBeCalledWith(MockValues.mCaptcha1);
            expect(UserService.getByUsername).toBeCalled();
            expect(UserService.getByUsername).toBeCalledWith(MockValues.mLoginUser1.username);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorDataResult);
        });

        test('Suspended user', async () => {
            jest.spyOn(RecaptchaService, 'verify').mockResolvedValueOnce(MockValues.mSuccessResult);
            jest.spyOn(UserService, 'getByUsername').mockResolvedValueOnce(MockValues.mSuccessDataResultUser1Suspended);

            const result = await AuthService.login(MockValues.mLoginUser1);

            expect(RecaptchaService.verify).toBeCalled();
            expect(RecaptchaService.verify).toBeCalledWith(MockValues.mCaptcha1);
            expect(UserService.getByUsername).toBeCalled();
            expect(UserService.getByUsername).toBeCalledWith(MockValues.mLoginUser1.username);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorDataResult);
        });

        test('Incorrect password', async () => {
            jest.spyOn(RecaptchaService, 'verify').mockResolvedValueOnce(MockValues.mSuccessResult);
            jest.spyOn(UserService, 'getByUsername').mockResolvedValueOnce(MockValues.mSuccessDataResultUser1);
            jest.spyOn(EncryptionService, 'compare').mockResolvedValueOnce(false);

            const result = await AuthService.login(MockValues.mLoginUser1);

            expect(RecaptchaService.verify).toBeCalled();
            expect(RecaptchaService.verify).toBeCalledWith(MockValues.mCaptcha1);
            expect(UserService.getByUsername).toBeCalled();
            expect(UserService.getByUsername).toBeCalledWith(MockValues.mLoginUser1.username);
            expect(EncryptionService.compare).toBeCalled();
            expect(EncryptionService.compare).toBeCalledWith(MockValues.mLoginUser1.password, MockValues.mSuccessDataResultUser1.data.password);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorDataResult);
        });

        test('Successful login', async () => {
            jest.spyOn(RecaptchaService, 'verify').mockResolvedValueOnce(MockValues.mSuccessResult);
            jest.spyOn(UserService, 'getByUsername').mockResolvedValueOnce(MockValues.mSuccessDataResultUser1);
            jest.spyOn(EncryptionService, 'compare').mockResolvedValueOnce(true);
            jest.spyOn(JWTService, 'generateToken').mockReturnValueOnce(MockValues.mToken1);

            const result = await AuthService.login(MockValues.mLoginUser1);

            expect(RecaptchaService.verify).toBeCalled();
            expect(RecaptchaService.verify).toBeCalledWith(MockValues.mCaptcha1);

            expect(UserService.getByUsername).toBeCalled();
            expect(UserService.getByUsername).toBeCalledWith(MockValues.mLoginUser1.username);

            expect(EncryptionService.compare).toBeCalled();
            expect(EncryptionService.compare).toBeCalledWith(MockValues.mLoginUser1.password, MockValues.mSuccessDataResultUser1.data.password);

            expect(JWTService.generateToken).toBeCalled();
            expect(JWTService.generateToken).toBeCalledWith(MockValues.mTokenPayloadUser1);

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessDataResult);
            expect(result.data).toEqual(MockValues.mToken1);
        });

    });


    describe('signUp', () => {

        test('Incorrect captcha', async () => {
            jest.spyOn(RecaptchaService, 'verify').mockResolvedValueOnce(MockValues.mErrorResult);

            const result = await AuthService.signUp(MockValues.mSignUp1);

            expect(RecaptchaService.verify).toBeCalled();
            expect(RecaptchaService.verify).toBeCalledWith(MockValues.mCaptcha1);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

        test('Non unique username or email', async () => {
            jest.spyOn(RecaptchaService, 'verify').mockResolvedValueOnce(MockValues.mSuccessResult);
            jest.spyOn(UserService, 'add').mockResolvedValueOnce(MockValues.mErrorDataResult);
            jest.spyOn(EmailAuthService, 'sendAccountVerificationEmail').mockResolvedValueOnce(MockValues.mSuccessResult);

            const result = await AuthService.signUp(MockValues.mSignUp1);

            expect(RecaptchaService.verify).toBeCalled();
            expect(RecaptchaService.verify).toBeCalledWith(MockValues.mCaptcha1);
            expect(UserService.add).toBeCalled();
            expect(UserService.add).toBeCalledWith(MockValues.mUserToAdd);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

        test('Successful signup', async () => {
            jest.spyOn(RecaptchaService, 'verify').mockResolvedValueOnce(MockValues.mSuccessResult);
            jest.spyOn(UserService, 'add').mockResolvedValueOnce(MockValues.mSuccessDataResultUser1);
            jest.spyOn(EmailAuthService, 'sendAccountVerificationEmail').mockResolvedValueOnce(MockValues.mSuccessResult);

            const result = await AuthService.signUp(MockValues.mSignUp1);

            expect(RecaptchaService.verify).toBeCalled();
            expect(RecaptchaService.verify).toBeCalledWith(MockValues.mCaptcha1);
            expect(UserService.add).toBeCalled();
            expect(UserService.add).toBeCalledWith(MockValues.mUserToAdd);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessResult);
        });

    });


    describe('sendAccountVerificationEmail', () => {

        test('Not existing or deleted user', async () => {
            jest.spyOn(UserService, 'getByEmail').mockResolvedValueOnce(MockValues.mErrorDataResult);
            jest.spyOn(EmailAuthService, 'sendAccountVerificationEmail').mockResolvedValueOnce(MockValues.mSuccessResult);

            const result = await AuthService.sendAccountVerification(MockValues.mEmail1);

            expect(UserService.getByEmail).toBeCalled();
            expect(UserService.getByEmail).toBeCalledWith(MockValues.mEmail1);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

        test('Suspended user', async () => {
            jest.spyOn(UserService, 'getByEmail').mockResolvedValueOnce(MockValues.mSuccessDataResultUser1Suspended);
            jest.spyOn(EmailAuthService, 'sendAccountVerificationEmail').mockResolvedValueOnce(MockValues.mSuccessResult);

            const result = await AuthService.sendAccountVerification(MockValues.mEmail1);

            expect(UserService.getByEmail).toBeCalled();
            expect(UserService.getByEmail).toBeCalledWith(MockValues.mEmail1);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

        test('Active user', async () => {
            jest.spyOn(UserService, 'getByEmail').mockResolvedValueOnce(MockValues.mSuccessDataResultUser1Active);
            jest.spyOn(EmailAuthService, 'sendAccountVerificationEmail').mockResolvedValueOnce(MockValues.mSuccessResult);

            const result = await AuthService.sendAccountVerification(MockValues.mEmail1);

            expect(UserService.getByEmail).toBeCalled();
            expect(UserService.getByEmail).toBeCalledWith(MockValues.mEmail1);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

        test('Successful verification code sending', async () => {
            jest.spyOn(UserService, 'getByEmail').mockResolvedValueOnce(MockValues.mSuccessDataResultUser1Passive);
            jest.spyOn(EmailAuthService, 'sendAccountVerificationEmail').mockResolvedValueOnce(MockValues.mSuccessResult);

            const result = await AuthService.sendAccountVerification(MockValues.mEmail1);

            expect(UserService.getByEmail).toBeCalled();
            expect(UserService.getByEmail).toBeCalledWith(MockValues.mEmail1);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessResult);
        });

    });


    describe('verifyAccount', () => {

        test('Wrong verification token', async () => {
            jest.spyOn(JWTService, 'verify').mockResolvedValueOnce(MockValues.mErrorDataResult);

            const result = await AuthService.verifyAccount(MockValues.mToken1);

            expect(JWTService.verify).toBeCalled();
            expect(JWTService.verify).toBeCalledWith(MockValues.mToken1);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

        test('Wrong token type', async () => {
            jest.spyOn(JWTService, 'verify').mockResolvedValueOnce(MockValues.mSuccessDataResultTokenPayloadUser1);

            const result = await AuthService.verifyAccount(MockValues.mToken1);

            expect(JWTService.verify).toBeCalled();
            expect(JWTService.verify).toBeCalledWith(MockValues.mToken1);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

        test('Not existing or deleted user', async () => {
            jest.spyOn(JWTService, 'verify').mockResolvedValueOnce(MockValues.mSuccessDataResultTokenPayloadVerifyUser1);
            jest.spyOn(UserService, 'getById').mockResolvedValueOnce(MockValues.mErrorDataResult);

            const result = await AuthService.verifyAccount(MockValues.mToken1);

            expect(JWTService.verify).toBeCalled();
            expect(JWTService.verify).toBeCalledWith(MockValues.mToken1);
            expect(UserService.getById).toBeCalled();
            expect(UserService.getById).toBeCalledWith(MockValues.mSuccessDataResultTokenPayloadVerifyUser1.data.id);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

        test('Suspended user', async () => {
            jest.spyOn(JWTService, 'verify').mockResolvedValueOnce(MockValues.mSuccessDataResultTokenPayloadVerifyUser1);
            jest.spyOn(UserService, 'getById').mockResolvedValueOnce(MockValues.mSuccessDataResultUser1Suspended);

            const result = await AuthService.verifyAccount(MockValues.mToken1);

            expect(JWTService.verify).toBeCalled();
            expect(JWTService.verify).toBeCalledWith(MockValues.mToken1);
            expect(UserService.getById).toBeCalled();
            expect(UserService.getById).toBeCalledWith(MockValues.mSuccessDataResultTokenPayloadVerifyUser1.data.id);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

        test('Active user', async () => {
            jest.spyOn(JWTService, 'verify').mockResolvedValueOnce(MockValues.mSuccessDataResultTokenPayloadVerifyUser1);
            jest.spyOn(UserService, 'getById').mockResolvedValueOnce(MockValues.mSuccessDataResultUser1Active);

            const result = await AuthService.verifyAccount(MockValues.mToken1);

            expect(JWTService.verify).toBeCalled();
            expect(JWTService.verify).toBeCalledWith(MockValues.mToken1);
            expect(UserService.getById).toBeCalled();
            expect(UserService.getById).toBeCalledWith(MockValues.mSuccessDataResultTokenPayloadVerifyUser1.data.id);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

        test('Activation fail', async () => {
            jest.spyOn(JWTService, 'verify').mockResolvedValueOnce(MockValues.mSuccessDataResultTokenPayloadVerifyUser1);
            jest.spyOn(UserService, 'getById').mockResolvedValueOnce(MockValues.mSuccessDataResultUser1Passive);
            jest.spyOn(UserService, 'selfActivate').mockResolvedValueOnce(MockValues.mErrorResult);

            const result = await AuthService.verifyAccount(MockValues.mToken1);

            expect(JWTService.verify).toBeCalled();
            expect(JWTService.verify).toBeCalledWith(MockValues.mToken1);
            expect(UserService.getById).toBeCalled();
            expect(UserService.getById).toBeCalledWith(MockValues.mSuccessDataResultTokenPayloadVerifyUser1.data.id);
            expect(UserService.selfActivate).toBeCalled();
            expect(UserService.selfActivate).toBeCalledWith(MockValues.mSuccessDataResultTokenPayloadVerifyUser1.data.id);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

        test('Successful activation', async () => {
            jest.spyOn(JWTService, 'verify').mockResolvedValueOnce(MockValues.mSuccessDataResultTokenPayloadVerifyUser1);
            jest.spyOn(UserService, 'getById').mockResolvedValueOnce(MockValues.mSuccessDataResultUser1Passive);
            jest.spyOn(UserService, 'selfActivate').mockResolvedValueOnce(MockValues.mSuccessResult);

            const result = await AuthService.verifyAccount(MockValues.mToken1);

            expect(JWTService.verify).toBeCalled();
            expect(JWTService.verify).toBeCalledWith(MockValues.mToken1);
            expect(UserService.getById).toBeCalled();
            expect(UserService.getById).toBeCalledWith(MockValues.mSuccessDataResultTokenPayloadVerifyUser1.data.id);
            expect(UserService.selfActivate).toBeCalled();
            expect(UserService.selfActivate).toBeCalledWith(MockValues.mSuccessDataResultTokenPayloadVerifyUser1.data.id);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessResult);
        });

    });


    describe('sendPasswordReset', () => {

        test('Not existing or deleted user', async () => {
            jest.spyOn(UserService, 'getByEmail').mockResolvedValueOnce(MockValues.mErrorDataResult);
            jest.spyOn(EmailAuthService, 'sendPasswordResetEmail').mockResolvedValueOnce(MockValues.mSuccessResult);

            const result = await AuthService.sendPasswordReset(MockValues.mEmail1);

            expect(UserService.getByEmail).toBeCalled();
            expect(UserService.getByEmail).toBeCalledWith(MockValues.mEmail1);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

        test('Suspended user', async () => {
            jest.spyOn(UserService, 'getByEmail').mockResolvedValueOnce(MockValues.mSuccessDataResultUser1Suspended);
            jest.spyOn(EmailAuthService, 'sendPasswordResetEmail').mockResolvedValueOnce(MockValues.mSuccessResult);

            const result = await AuthService.sendPasswordReset(MockValues.mEmail1);

            expect(UserService.getByEmail).toBeCalled();
            expect(UserService.getByEmail).toBeCalledWith(MockValues.mEmail1);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

        test('Passive user', async () => {
            jest.spyOn(UserService, 'getByEmail').mockResolvedValueOnce(MockValues.mSuccessDataResultUser1Passive);
            jest.spyOn(EmailAuthService, 'sendPasswordResetEmail').mockResolvedValueOnce(MockValues.mSuccessResult);

            const result = await AuthService.sendPasswordReset(MockValues.mEmail1);

            expect(UserService.getByEmail).toBeCalled();
            expect(UserService.getByEmail).toBeCalledWith(MockValues.mEmail1);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

        test('Successful reset code sending', async () => {
            jest.spyOn(UserService, 'getByEmail').mockResolvedValueOnce(MockValues.mSuccessDataResultUser1Active);
            jest.spyOn(EmailAuthService, 'sendPasswordResetEmail').mockResolvedValueOnce(MockValues.mSuccessResult);

            const result = await AuthService.sendPasswordReset(MockValues.mEmail1);

            expect(UserService.getByEmail).toBeCalled();
            expect(UserService.getByEmail).toBeCalledWith(MockValues.mEmail1);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessResult);
        });

    });


    describe('resetPassword', () => {

        test('Wrong verification token', async () => {
            jest.spyOn(JWTService, 'verify').mockResolvedValueOnce(MockValues.mErrorDataResult);

            const result = await AuthService.resetPassword(MockValues.mToken1, MockValues.mPassword1);

            expect(JWTService.verify).toBeCalled();
            expect(JWTService.verify).toBeCalledWith(MockValues.mToken1);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

        test('Wrong token type', async () => {
            jest.spyOn(JWTService, 'verify').mockResolvedValueOnce(MockValues.mSuccessDataResultTokenPayloadUser1);

            const result = await AuthService.resetPassword(MockValues.mToken1, MockValues.mPassword1);

            expect(JWTService.verify).toBeCalled();
            expect(JWTService.verify).toBeCalledWith(MockValues.mToken1);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

        test('Not existing or deleted user', async () => {
            jest.spyOn(JWTService, 'verify').mockResolvedValueOnce(MockValues.mSuccessDataResultTokenPayloadResetUser1);
            jest.spyOn(UserService, 'getById').mockResolvedValueOnce(MockValues.mErrorDataResult);

            const result = await AuthService.resetPassword(MockValues.mToken1, MockValues.mPassword1);

            expect(JWTService.verify).toBeCalled();
            expect(JWTService.verify).toBeCalledWith(MockValues.mToken1);
            expect(UserService.getById).toBeCalled();
            expect(UserService.getById).toBeCalledWith(MockValues.mSuccessDataResultTokenPayloadResetUser1.data.id);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

        test('Non active user', async () => {
            jest.spyOn(JWTService, 'verify').mockResolvedValueOnce(MockValues.mSuccessDataResultTokenPayloadResetUser1);
            jest.spyOn(UserService, 'getById').mockResolvedValueOnce(MockValues.mSuccessDataResultUser1Passive);

            const result = await AuthService.resetPassword(MockValues.mToken1, MockValues.mPassword1);

            expect(JWTService.verify).toBeCalled();
            expect(JWTService.verify).toBeCalledWith(MockValues.mToken1);
            expect(UserService.getById).toBeCalled();
            expect(UserService.getById).toBeCalledWith(MockValues.mSuccessDataResultTokenPayloadResetUser1.data.id);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

        test('Password reset fail', async () => {
            jest.spyOn(JWTService, 'verify').mockResolvedValueOnce(MockValues.mSuccessDataResultTokenPayloadResetUser1);
            jest.spyOn(UserService, 'getById').mockResolvedValueOnce(MockValues.mSuccessDataResultUser1Active);
            jest.spyOn(UserService, 'update').mockResolvedValueOnce(MockValues.mErrorResult);

            const result = await AuthService.resetPassword(MockValues.mToken1, MockValues.mPassword1);

            expect(JWTService.verify).toBeCalled();
            expect(JWTService.verify).toBeCalledWith(MockValues.mToken1);
            expect(UserService.getById).toBeCalled();
            expect(UserService.getById).toBeCalledWith(MockValues.mSuccessDataResultTokenPayloadResetUser1.data.id);
            expect(UserService.update).toBeCalled();
            expect(UserService.update).toBeCalledWith(MockValues.mSuccessDataResultTokenPayloadResetUser1.data.id, MockValues.mUserToUpdateWithPassword, MockValues.mSuccessDataResultTokenPayloadResetUser1.data);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

        test('Successful password reset', async () => {
            jest.spyOn(JWTService, 'verify').mockResolvedValueOnce(MockValues.mSuccessDataResultTokenPayloadResetUser1);
            jest.spyOn(UserService, 'getById').mockResolvedValueOnce(MockValues.mSuccessDataResultUser1Active);
            jest.spyOn(UserService, 'update').mockResolvedValueOnce(MockValues.mSuccessResult);

            const result = await AuthService.resetPassword(MockValues.mToken1, MockValues.mPassword1);

            expect(JWTService.verify).toBeCalled();
            expect(JWTService.verify).toBeCalledWith(MockValues.mToken1);
            expect(UserService.getById).toBeCalled();
            expect(UserService.getById).toBeCalledWith(MockValues.mSuccessDataResultTokenPayloadResetUser1.data.id);
            expect(UserService.update).toBeCalled();
            expect(UserService.update).toBeCalledWith(MockValues.mSuccessDataResultTokenPayloadResetUser1.data.id, MockValues.mUserToUpdateWithPassword, MockValues.mSuccessDataResultTokenPayloadResetUser1.data);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessResult);
        });

    });


});