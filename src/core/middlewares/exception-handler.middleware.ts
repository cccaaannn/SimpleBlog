import { Request, Response, NextFunction } from 'express';
import { ErrorResult } from "../results/Result";

function exceptionHandler() {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // console.error(`Error ${res.locals.err.message}`);
            return res.status(500).json(new ErrorResult("Internal server error"));
        } catch (err: any) {
            next(err);
        }
    }
}

export { exceptionHandler }
