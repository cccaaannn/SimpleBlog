interface IResult {
    message?: string,
    status: boolean
}

class Result implements IResult {
    public message?: string
    public status: boolean
    constructor(status: boolean, message?: string) {
        this.message = message;
        this.status = status;
    }
}

class SuccessResult extends Result {
    constructor(message?: string) {
        super(true, message);
    }
}

class ErrorResult extends Result {
    constructor(message?: string) {
        super(false, message);
    }
}


export { IResult, Result, SuccessResult, ErrorResult };