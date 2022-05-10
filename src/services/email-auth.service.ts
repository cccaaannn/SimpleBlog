// Node imports
import * as fs from 'fs/promises';

// Project imports
import JWTService from '../core/services/jwt.service';
import { EmailService } from '../core/services/email.service';
import { EmailAuthConfig } from '../configs/email-verification.config';
import { FrontEndConfig } from '../configs/front-end.config';
import UserService from './user.service';

import { ErrorResult, IResult, Result } from '../core/results/Result';
import { DataResult } from '../core/results/DataResult';
import { TokenPayload } from '../core/types/TokenPayload';
import { Token } from '../core/types/Token';
import { User } from '../types/User';
import TokenType from '../core/types/enums/TokenType';


// Instantiate email service
const emailService = new EmailService();

async function sendAccountVerificationEmail(userId: string): Promise<IResult> {

    // Read html template, this is dynamic so template can be changed while backend is running. 
    let template: string | null = null;
    try {
        template = await fs.readFile(EmailAuthConfig.AccountVerification.EMAIL_HTML_TEMPLATE_PATH, 'utf8')
    }
    catch (err) {
        // console.info(err);
        return new ErrorResult("Can not send email this time.");
    }

    // Get user information
    const userResult: DataResult<User | null> = await UserService.getById(userId);
    if (userResult == null || userResult.data == null || !userResult.status) {
        return new ErrorResult("User not exists");
    }

    // build token payload for verification email
    const tokenPayload: TokenPayload = {
        id: userResult.data._id + "",
        email: userResult.data.email,
        role: userResult.data.role,
        status: userResult.data.status,
        username: userResult.data.username,
        type: TokenType.VERIFY
    }
    const token: Token = JWTService.generateToken(tokenPayload, EmailAuthConfig.AccountVerification.JWT_TOKEN_EXPIRATION)

    // Build url for account activation, this will be embedded in html content of the email
    const URL: string = `${process.env.FRONTEND_URL}${FrontEndConfig.Paths.FRONTEND_ACCOUNT_VERIFICATION_PATH}?token=${token.token}`;

    // Build email data
    const to = userResult.data.email;
    const subject = EmailAuthConfig.AccountVerification.EMAIL_SUBJECT;
    const text = EmailAuthConfig.AccountVerification.EMAIL_TEXT.replace("{{URL}}", URL);
    const html = template.replace("{{URL}}", URL);

    // Send
    const emailResult: Result = await emailService.send(to, subject, text, html);

    return emailResult;
}


async function sendPasswordResetEmail(userId: string): Promise<IResult> {

    // Read html template, this is dynamic so template can be changed while backend is running. 
    let template: string | null = null;
    try {
        template = await fs.readFile(EmailAuthConfig.PasswordReset.EMAIL_HTML_TEMPLATE_PATH, 'utf8')
    }
    catch (err) {
        // console.info(err);
        return new ErrorResult("Can not send email this time.");
    }

    // Get user information
    const userResult: DataResult<User | null> = await UserService.getById(userId);
    if (userResult == null || userResult.data == null || !userResult.status) {
        return new ErrorResult("User not exists");
    }

    // build token payload for verification email
    const tokenPayload: TokenPayload = {
        id: userResult.data._id + "",
        email: userResult.data.email,
        role: userResult.data.role,
        status: userResult.data.status,
        username: userResult.data.username,
        type: TokenType.RESET
    }
    const token: Token = JWTService.generateToken(tokenPayload, EmailAuthConfig.PasswordReset.JWT_TOKEN_EXPIRATION)

    // Build url for account activation, this will be embedded in html content of the email
    const URL: string = `${process.env.FRONTEND_URL}${FrontEndConfig.Paths.FRONTEND_PASSWORD_RESET_PATH}?token=${token.token}`;

    // Build email data
    const to = userResult.data.email;
    const subject = EmailAuthConfig.PasswordReset.EMAIL_SUBJECT;
    const text = EmailAuthConfig.PasswordReset.EMAIL_TEXT.replace("{{URL}}", URL);
    const html = template.replace("{{URL}}", URL);

    // Send
    const emailResult: Result = await emailService.send(to, subject, text, html);

    return emailResult;
}


const EmailAuthService = { sendAccountVerificationEmail, sendPasswordResetEmail }
export default EmailAuthService;
