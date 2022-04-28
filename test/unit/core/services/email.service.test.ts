import nodemailer from 'nodemailer';

import { ErrorResult, Result, SuccessResult } from "../../../../src/core/results/Result";
import { EmailService } from "../../../../src/core/services/email.service";


describe('email service', () => {

    describe('send', () => {

        test('Email sent error', async () => {
            jest.spyOn(nodemailer, 'createTransport').mockImplementationOnce((): any => {
                return {
                    sendMail: async function () {
                        throw new Error();
                    }
                }
            });

            const emailService = new EmailService();

            const result: Result = await emailService.send("", "", "", "");

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(ErrorResult);
        });

        test('Successful email sent', async () => {
            jest.spyOn(nodemailer, 'createTransport').mockImplementationOnce((): any => {
                return {
                    sendMail: async function () {
                        return { response: "" };
                    }
                }
            });

            const emailService = new EmailService();

            const result: Result = await emailService.send("", "", "", "");

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SuccessResult);
        });

    });

});