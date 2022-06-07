## SimpleBlogBackend

Practice project for various web technologies.

![GitHub top language](https://img.shields.io/github/languages/top/cccaaannn/SimpleBlogBackend?color=blue) [![Coverage Status](https://coveralls.io/repos/github/cccaaannn/SimpleBlogBackend/badge.svg?branch=master)](https://coveralls.io/github/cccaaannn/SimpleBlogBackend?branch=master) ![GitHub repo size](https://img.shields.io/github/repo-size/cccaaannn/SimpleBlogBackend?color=darkgreen) [![GitHub](https://img.shields.io/github/license/cccaaannn/SimpleBlogBackend?color=purple)](https://github.com/cccaaannn/SimpleBlogBackend/blob/master/LICENSE) [![Docker Image Size (tag)](https://img.shields.io/docker/image-size/cccaaannn/simple-blog-backend/latest?color=orange)](https://hub.docker.com/r/cccaaannn/simple-blog-backend)

---

## CI/CD Setup
1. Info
    - This repo uses GitHub actions for ci/cd.
    - Workflow
        1. Testing.
        2. Coverage report. (coveralls)
        3. Docker image build.
        4. Push to DockerHub and Heroku. (Heroku will auto deploy container)
2. Requirements
    - In order to use ci, these environment variables must be set.
    - GitHub environments are used for deployment.
    - Heroku environments are used for running the backend.

```shell
# GitHub

DOCKER_PASSWORD
DOCKER_USERNAME
HEROKU_API_KEY
HEROKU_EMAIL
```

```shell
# Heroku
IS_HEROKU

MONGO_CONNECTION_STRING

EMAIL_SERVICE
EMAIL_PASSWORD
EMAIL_USERNAME

JWT_PRIVATE_KEY
JWT_USER_TOKEN_EXPIRATION

RECAPTCHA_SECRET_KEY

FRONTEND_URL
```
