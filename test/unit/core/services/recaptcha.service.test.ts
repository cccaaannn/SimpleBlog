import axios from 'axios';
import { ErrorResult, SuccessResult } from '../../../../src/core/results/Result';

import EncryptionService from "../../../../src/core/services/encryption.service";
import RecaptchaService from "../../../../src/core/services/recaptcha.service";

import { MockValues } from "../../../utils/mocks/const-mock-values";


describe('recaptcha service', () => {

    describe('verify', () => {

        test('Incorrect captcha answer', async () => {
            jest.spyOn(axios, 'post').mockResolvedValueOnce(MockValues.mCaptchaResponse1False);

            const result = await RecaptchaService.verify(MockValues.mCaptcha1);

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

        test('Low captcha answer', async () => {
            jest.spyOn(axios, 'post').mockResolvedValueOnce(MockValues.mCaptchaResponse1FalseLow);

            const result = await RecaptchaService.verify(MockValues.mCaptcha1);

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

        test('Exception during verification', async () => {
            jest.spyOn(axios, 'post').mockImplementationOnce((): any => {
                throw new Error();
            });

            const result = await RecaptchaService.verify(MockValues.mCaptcha1);

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

        test('Successful verification', async () => {
            jest.spyOn(axios, 'post').mockResolvedValueOnce(MockValues.mCaptchaResponse1Correct);

            const result = await RecaptchaService.verify(MockValues.mCaptcha1);

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessResult);
        });

    });

});