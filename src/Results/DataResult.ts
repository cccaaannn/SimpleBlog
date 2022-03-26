import { IResult, Result } from "./Result"

interface IDataResult<T> extends IResult {
    data: T
}

class DataResult<T> extends Result implements IDataResult<T>{
    public data: T;
    constructor(status: boolean, data: T, message?: string) {
        super(status, message);
        this.data = data;
    }
}

class SuccessDataResult<T> extends DataResult<T> {
    constructor(data: T, message?: string) {
        super(true, data, message);
    }
}

class ErrorDataResult<T> extends DataResult<T> {
    constructor(data: T, message?: string) {
        super(false, data, message);
    }
}


export { IDataResult, DataResult, SuccessDataResult, ErrorDataResult };