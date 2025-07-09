// src/controllers/kitController.ts
import { Response, Request, RequestHandler } from 'express';
import { prisma } from '../prismaClient';
import { AuthenticateRequest } from "../middleware/authenticate";

export const getUserKits = async (req: AuthenticateRequest, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ error: 'Non autorisé' });
            return
        }

        const kits = await prisma.kit.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });

        res.status(200).json(kits);
    } catch (error) {
        console.error("Erreur récupération des kits :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

export const getKitById = async (req: AuthenticateRequest, res: Response) => {
    try {
        const kitId = parseInt(req.params.id, 10);
        const userId = req.userId;

        if (isNaN(kitId) || !userId) {
            res.status(400).json({ error: 'Paramètres invalides' });
            return;
        }

        const kit = await prisma.kit.findFirst({
            where: {
                id: kitId,
                userId: userId,
            }
        });

        if (!kit) {
            res.status(404).json({ error: 'Kit non trouvé' });
            return;
        }

        res.status(200).json(kit);
    } catch (err) {
        console.error("Erreur récupération du kit :", err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};


export const createKit = async (req: AuthenticateRequest, res: Response) => {
    console.log('✅ Données reçues :', req.body);
    const { name, config, isPublic, description, tags } = req.body;
    console.log("✅ Backend : route POST /api/kits appelée");

    if (!name || !config || typeof req.userId !== 'number') {
        res.status(400).json({ error: 'Champs requis manquants' });
        return;
    }

    try {
        const newKit = await prisma.kit.create({
            data: {
                name: name,
                config,
                userId: req.userId,
                isPublic: isPublic ?? false,
                description: description || '',
                tags: Array.isArray(tags) ? tags : [],
            },
        });

        res.status(201).json({ message: 'Kit créé avec succès', kit: newKit });
    } catch (err) {
        console.error('Erreur création kit :', err);
        res.status(500).json({ error: 'Erreur serveur', details: err });
    }
};

export const updateKit = async (req: Request, res: Response) => {
    try {
        const kitId = parseInt(req.params.id, 10);
        const { name, description, config, tags, isPublic } = req.body;

        const updatedKit = await prisma.kit.update({
            where: { id: kitId },
            data: { name, description, config, tags, isPublic },
        });

        res.status(200).json(updatedKit);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du kit :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
