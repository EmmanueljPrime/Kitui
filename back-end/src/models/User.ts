import bcrypt from 'bcryptjs';
import { prisma } from '../prismaClient'; // Assure-toi que Prisma Client est bien initialisé

interface User {
    id: number;       // Identifiant unique de l'utilisateur
    username: string; // Nom d'utilisateur
    password: string; // Mot de passe haché
}

// Fonction pour trouver un utilisateur par son nom d'utilisateur
const findUserByUsername = async (username: string): Promise<User | null> => {
    return await prisma.user.findUnique({
        where: { username: username }
    });
};

// Fonction pour vérifier le mot de passe avec bcrypt
const verifyPassword = async (storedPassword: string, password: string): Promise<boolean> => {
    return await bcrypt.compare(password, storedPassword);
};

export { findUserByUsername, verifyPassword };