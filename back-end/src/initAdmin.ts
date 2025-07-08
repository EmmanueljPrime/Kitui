import { prisma } from './prismaClient';
import bcrypt from 'bcryptjs';

const createAdmin = async () => {
    // Hachage du mot de passe 'admin'
    const hashedPassword = await bcrypt.hash('admin', 10);

    // Création de l'utilisateur 'admin'
    const admin = await prisma.user.create({
        data: {
            username: 'admin',
            password: hashedPassword,
        },
    });

    console.log('Admin user created:', admin);
};

createAdmin()
    .catch((error) => {
        console.error('Error creating admin:', error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });