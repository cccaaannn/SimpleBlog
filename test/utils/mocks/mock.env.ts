// General
process.env.NODE_ENV="test"

// JWT settings
process.env.JWT_PRIVATE_KEY="PRIVATE_KEY"
process.env.JWT_USER_TOKEN_EXPIRATION="2592000s"
process.env.JWT_EMAIL_VERIFICATION_TOKEN_EXPIRATION="2592000s"

// Email settings
process.env.EMAIL_SERVICE="SERVICE"
process.env.EMAIL_USERNAME="USERNAME"
process.env.EMAIL_PASSWORD="PASSWORD"
