import {Request, Response} from 'express';
import { prisma } from '../prismaClient';
import {AuthenticateRequest} from "../middleware/authenticate";

export const saveKit = async(req: AuthenticateRequest, res: Response) => {
    const {kitName, config, userId} = req.body;
    if(!kitName || !config || !userId){
        res.status(400).send({error: 'Champs requis manquants'});
    }

    if(req.userId !== userId){
        res.status(403).send({error: 'Non Autorisé'});
    }

    try{
        const kit= await prisma.kit.create({
            data:{
                name: kitName,
                config,
                userId
            }
        })
        return res.status(201).json({message:'Kit sauvegardé',kit});
    }catch(err){
        console.error('Erreur lors de la sauvegarde du kit:',err)
        return res.status(500).json({message:'Erreur serveur',err});
    }
}

export const getUserKits = async(req: AuthenticateRequest, res: Response) => {
    const userId = parseInt(req.params.userId);

    if(isNaN(userId)){
        return res.status(400).send({message: 'ID utilisateur invalide'});
    }

    if(req.userId !== userId){
        res.status(403).send({error: 'Non Autorisé'});
    }

    try {
        const kits = await prisma.kit.findMany({
            where: {userId},
            orderBy: {createdAt: 'desc'}
        })
        return res.status(200).json(kits)
    }catch(err){
        console.error('Erreur lors de la récupération des kits:', err);
        return res.status(500).json({ message: 'Erreur serveur', err });
    }
}

export const updateKit = async (req: AuthenticateRequest, res: Response) => {
    const kitId = parseInt(req.params.kitId);
    const { kitName, config } = req.body;

    if(isNaN(kitId)){
        return res.status(400).send({message: 'ID de kit invalide'});
    }

    try{
        const existingKit = await prisma.kit.findUnique({where: {id: kitId}});

        if(!existingKit || existingKit.userId !== req.userId){
            return res.status(403).json({message: 'Non autorisé'})
        }

        const updatedKit = await prisma.kit.update({
            where: {id: kitId},
            data: {
                name: kitName,
                config
            }
        })
        return res.status(200).json({message: 'Kit mis à jour', kit: updatedKit});
    }catch(err){
        console.error('Erreur lors de la mise à jour du kit:', err);
        return res.status(500).json({ message: 'Erreur serveur', err });
    }
}

export const deleteKit = async (req: AuthenticateRequest, res: Response) => {
    const kitId = parseInt(req.params.kitId);

    if(isNaN(kitId)){
        return res.status(400).send({message: 'ID de kit invalide'});
    }

    try{
        const existingKit = await prisma.kit.findUnique({ where: { id: kitId } });

        if (!existingKit || existingKit.userId !== req.userId) {
            return res.status(403).json({ message: 'Non autorisé' });
        }

        await prisma.kit.delete({where: {id: kitId}});
        return res.status(200).json({message: 'Kit supprimé avec succès'});
    }catch(err){
        console.error('Erreur lors de la suppression du kit:', err);
        return res.status(500).json({ message: 'Erreur serveur', err });
    }
}