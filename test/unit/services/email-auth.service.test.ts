import fs from 'fs/promises';

import EmailAuthService from "../../../src/services/email-auth.service";
import JWTService from '../../../src/core/services/jwt.service';
import UserService from '../../../src/services/user.service';

import { ErrorResult, SuccessResult } from '../../../src/core/results/Result';
import { MockValues } from "../../utils/mocks/const-mock-values";
import { EmailAuthConfig } from '../../../src/configs/email-verification.config';


// Special mock case, EmailService is a class that is instantiated inside the email-verification.service
jest.mock('../../../src/core/services/email.service', () => {
    return {
        EmailService: jest.fn().mockImplementation(() => {
            return {
                send: async function() {
                    return new SuccessResult();
                }
            }   
        })
    }
})

describe('Email auth service', () => {

    describe('sendAccountVerificationEmail', () => {

        test('Template file read error', async () => {
            jest.spyOn(fs, 'readFile').mockImplementationOnce(() => {
                throw new Error();
            });

            const result: any = await EmailAuthService.sendAccountVerificationEmail(MockValues.mUserId1);

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

        test('Not existing or deleted user', async () => {
            jest.spyOn(UserService, 'getById').mockResolvedValueOnce(MockValues.mErrorDataResult);

            const result: any = await EmailAuthService.sendAccountVerificationEmail(MockValues.mUserId1);

            expect(UserService.getById).toBeCalled();
            expect(UserService.getById).toBeCalledWith(MockValues.mUserId1);

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });
        
        test('Successful email send', async () => {
            jest.spyOn(UserService, 'getById').mockResolvedValueOnce(MockValues.mSuccessDataResultUser1);
            jest.spyOn(JWTService, 'generateToken').mockReturnValueOnce(MockValues.mToken1);

            const result: any = await EmailAuthService.sendAccountVerificationEmail(MockValues.mUserId1);

            expect(UserService.getById).toBeCalled();
            expect(UserService.getById).toBeCalledWith(MockValues.mUserId1);

            expect(JWTService.generateToken).toBeCalled();
            expect(JWTService.generateToken).toBeCalledWith(MockValues.mTokenPayloadVerifyUser1, EmailAuthConfig.AccountVerification.JWT_TOKEN_EXPIRATION);

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessResult);
        });

    });

    describe('sendPasswordResetEmail', () => {

        test('Template file read error', async () => {
            jest.spyOn(fs, 'readFile').mockImplementationOnce(() => {
                throw new Error();
            });

            const result: any = await EmailAuthService.sendPasswordResetEmail(MockValues.mUserId1);

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

        test('Not existing or deleted user', async () => {
            jest.spyOn(UserService, 'getById').mockResolvedValueOnce(MockValues.mErrorDataResult);

            const result: any = await EmailAuthService.sendPasswordResetEmail(MockValues.mUserId1);

            expect(UserService.getById).toBeCalled();
            expect(UserService.getById).toBeCalledWith(MockValues.mUserId1);

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });
        
        test('Successful email send', async () => {
            jest.spyOn(UserService, 'getById').mockResolvedValueOnce(MockValues.mSuccessDataResultUser1);
            jest.spyOn(JWTService, 'generateToken').mockReturnValueOnce(MockValues.mToken1);

            const result: any = await EmailAuthService.sendPasswordResetEmail(MockValues.mUserId1);

            expect(UserService.getById).toBeCalled();
            expect(UserService.getById).toBeCalledWith(MockValues.mUserId1);

            expect(JWTService.generateToken).toBeCalled();
            expect(JWTService.generateToken).toBeCalledWith(MockValues.mTokenPayloadResetUser1, EmailAuthConfig.PasswordReset.JWT_TOKEN_EXPIRATION);

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessResult);
        });

    });

});
