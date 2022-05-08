import { Request, Response, NextFunction } from 'express';
import { ErrorResult } from "../results/Result";

function notFound() {
    return (req: Request, res: Response, next: NextFunction) => {
        res.status(404).json(new ErrorResult("Endpoint not found"));
    }
}

export { notFound }
