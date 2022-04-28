import fs from 'fs/promises';

import EmailVerificationService from "../../../src/services/email-verification.service";
import JWTService from '../../../src/core/services/jwt.service';
import UserService from '../../../src/services/user.service';

import { ErrorResult, SuccessResult } from '../../../src/core/results/Result';
import { MockValues } from "../../utils/mocks/const-mock-values";


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

describe('Email verification service', () => {

    describe('sendVerificationEmail', () => {

        test('Template file read error', async () => {
            jest.spyOn(fs, 'readFile').mockImplementationOnce(() => {
                throw new Error();
            });

            const result: any = await EmailVerificationService.sendVerificationEmail(MockValues.mUserId1);

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

        test('Not existing or deleted user', async () => {
            jest.spyOn(UserService, 'getById').mockResolvedValueOnce(MockValues.mErrorDataResult);

            const result: any = await EmailVerificationService.sendVerificationEmail(MockValues.mUserId1);

            expect(UserService.getById).toBeCalled();
            expect(UserService.getById).toBeCalledWith(MockValues.mUserId1);

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });
        
        test('Successful email send', async () => {
            jest.spyOn(UserService, 'getById').mockResolvedValueOnce(MockValues.mSuccessDataResultUser1);
            jest.spyOn(JWTService, 'generateToken').mockReturnValueOnce(MockValues.mToken1);

            const result: any = await EmailVerificationService.sendVerificationEmail(MockValues.mUserId1);

            expect(UserService.getById).toBeCalled();
            expect(UserService.getById).toBeCalledWith(MockValues.mUserId1);

            expect(JWTService.generateToken).toBeCalled();
            expect(JWTService.generateToken).toBeCalledWith(MockValues.mTokenPayloadUser1, process.env.JWT_EMAIL_VERIFICATION_TOKEN_EXPIRATION);

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessResult);
        });

    });

});
