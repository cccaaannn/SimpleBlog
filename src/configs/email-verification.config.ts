export const EmailVerificationConfig = {
    EMAIL_SUBJECT: "Account activation",
    EMAIL_TEXT: "It appears your email client does not supports html content, please visit the link to verify your account.\n{{URL}}",
    EMAIL_HTML_TEMPLATE_PATH: 'src/resources/email-verification-template.html',
    JWT_EMAIL_VERIFICATION_TOKEN_EXPIRATION: "86400s"
}