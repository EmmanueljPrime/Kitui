import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticateRequest extends Request {
    userId?: number;
}

export const authenticate: RequestHandler = (req, res, next) => {
    const token = req.cookies?.token; // ✅ on récupère le token du cookie

    if (!token) {
        console.warn('❌ Token manquant');
        res.status(401).json({ error: 'Token manquant' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
        console.log('✅ Token décodé :', decoded);
        (req as AuthenticateRequest).userId = decoded.userId;
        next();
    } catch (err) {
        console.error("Erreur de vérification du token :", err);
        res.status(403).json({ error: 'Token invalide' });
        return;
    }
};
