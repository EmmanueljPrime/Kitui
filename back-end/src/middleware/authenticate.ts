import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticateRequest extends Request {
    userId?: number;
}

export const authenticate = (req: AuthenticateRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if(!token) {
        return res.status(401).send('Token Manquant');
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        req.userId = (decoded as {userId: number}).userId;
        next()
    }catch(err){
        return res.status(403).send('Token Invalide');
    }
}