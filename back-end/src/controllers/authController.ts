import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prismaClient'; // Assure-toi que Prisma Client est correctement importé

// const login = async (req: Request, res: Response): Promise<Response> => {
//     const { username, password } = req.body;
//
//     // Recherche l'utilisateur dans la base de données
//     const user = await prisma.user.findUnique({
//         where: { username }
//     });
//
//     if (!user) {
//         return res.status(400).json({ message: 'Utilisateur non trouvé' });
//     }
//
//     // Vérifie le mot de passe
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//         return res.status(400).json({ message: 'Mot de passe incorrect' });
//     }
//
//     const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
//
//     return res.json({ message: 'Authentification réussie', token });
// };

const login = async (req: Request, res: Response): Promise<Response> => {
    const { username, password } = req.body;

    try {
        // Recherche l'utilisateur dans la base de données
        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (!user) {
            return res.status(400).json({ message: 'Utilisateur non trouvé' });
        }

        // Vérifie le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Mot de passe incorrect' });
        }

        // Génère le token JWT
        const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

        return res.json({ message: 'Authentification réussie', token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};


export { login };