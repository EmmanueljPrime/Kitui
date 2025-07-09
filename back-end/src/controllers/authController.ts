import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prismaClient';

const login = async (req: Request, res: Response): Promise<Response> => {
    const { username, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (!user) {
            return res.status(400).json({ message: 'Utilisateur non trouvé' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Mot de passe incorrect' });
        }

        // 👉 Corrigé : on inclut l'ID de l'utilisateur dans le token pour l'utiliser dans les routes protégées
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 jours
        });
        return res.json({
            message: 'Authentification réussie',
            user: {
                id: user.id,
                username: user.username,
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};

export { login };
