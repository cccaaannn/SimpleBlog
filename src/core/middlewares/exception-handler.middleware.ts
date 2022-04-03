import { ErrorResult } from "../results/Result";

function exceptionHandler() {
    return (req: any, res: any, next: any) => {
        try {
            console.error(`Error ${res.locals.err.message}`);
            return res.status(500).json(new ErrorResult("Internal server error"));
        } catch (err: any) {
            next(err);
        }
    }
}

export { exceptionHandler }
