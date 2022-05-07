import { Request, Response, NextFunction } from 'express';

function bodyTrimer() {
    return (req: Request, res: Response, next: NextFunction) => {
        let tempBody: any = {...req.body};
        for (const key in req.body) {
            if(typeof req.body[key] === 'string') {
                tempBody[key] = req.body[key].trim()
            }
        }
        req.body = tempBody;
        next();
    }
}

export { bodyTrimer }
