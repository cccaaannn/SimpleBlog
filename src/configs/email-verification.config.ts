export const EmailAuthConfig = {

    AccountVerification: {
        EMAIL_SUBJECT: "Account activation",
        EMAIL_TEXT: "It appears your email client does not supports html content, please visit the link to verify your account.\n{{URL}}",
        EMAIL_HTML_TEMPLATE_PATH: 'src/resources/account-verification-email-template.html',
        JWT_TOKEN_EXPIRATION: "3600s" // 1 hour
    },

    PasswordReset: {
        EMAIL_SUBJECT: "Password reset",
        EMAIL_TEXT: "It appears your email client does not supports html content, please visit the link to reset your password.\n{{URL}}",
        EMAIL_HTML_TEMPLATE_PATH: 'src/resources/password-reset-email-template.html',
        JWT_TOKEN_EXPIRATION: "3600s" // 1 hour
    }

}