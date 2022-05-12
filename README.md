## SimpleBlogBackend

Practice project for various web technologies.

![GitHub top language](https://img.shields.io/github/languages/top/cccaaannn/SimpleBlogBackend?color=blue) [![Coverage Status](https://coveralls.io/repos/github/cccaaannn/SimpleBlogBackend/badge.svg?branch=master)](https://coveralls.io/github/cccaaannn/SimpleBlogBackend?branch=master) ![GitHub repo size](https://img.shields.io/github/repo-size/cccaaannn/SimpleBlogBackend?color=purple) [![GitHub](https://img.shields.io/github/license/cccaaannn/SimpleBlogBackend?color=orange)](https://github.com/cccaaannn/SimpleBlogBackend/blob/master/LICENSE)

---

## CI/CD Setup
1. Info
    - This repo uses GitHub actions for ci/cd.
    - If all tests pass a docker image is built and pushed to DockerHub & Heroku.
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

MONGO_CONNECTION_STRING

EMAIL_SERVICE
EMAIL_PASSWORD
EMAIL_USERNAME

JWT_PRIVATE_KEY
JWT_USER_TOKEN_EXPIRATION

FRONTEND_URL
```
