"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteKit = exports.updateKit = exports.getUserKits = exports.saveKit = void 0;
const prismaClient_1 = require("../prismaClient");
const saveKit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { kitName, config, userId } = req.body;
    if (!kitName || !config || !userId) {
        res.status(400).send({ error: 'Champs requis manquants' });
    }
    if (req.userId !== userId) {
        res.status(403).send({ error: 'Non Autorisé' });
    }
    try {
        const kit = yield prismaClient_1.prisma.kit.create({
            data: {
                name: kitName,
                config,
                userId
            }
        });
        return res.status(201).json({ message: 'Kit sauvegardé', kit });
    }
    catch (err) {
        console.error('Erreur lors de la sauvegarde du kit:', err);
        return res.status(500).json({ message: 'Erreur serveur', err });
    }
});
exports.saveKit = saveKit;
const getUserKits = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
        return res.status(400).send({ message: 'ID utilisateur invalide' });
    }
    if (req.userId !== userId) {
        res.status(403).send({ error: 'Non Autorisé' });
    }
    try {
        const kits = yield prismaClient_1.prisma.kit.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        return res.status(200).json(kits);
    }
    catch (err) {
        console.error('Erreur lors de la récupération des kits:', err);
        return res.status(500).json({ message: 'Erreur serveur', err });
    }
});
exports.getUserKits = getUserKits;
const updateKit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const kitId = parseInt(req.params.kitId);
    const { kitName, config } = req.body;
    if (isNaN(kitId)) {
        return res.status(400).send({ message: 'ID de kit invalide' });
    }
    try {
        const existingKit = yield prismaClient_1.prisma.kit.findUnique({ where: { id: kitId } });
        if (!existingKit || existingKit.userId !== req.userId) {
            return res.status(403).json({ message: 'Non autorisé' });
        }
        const updatedKit = yield prismaClient_1.prisma.kit.update({
            where: { id: kitId },
            data: {
                name: kitName,
                config
            }
        });
        return res.status(200).json({ message: 'Kit mis à jour', kit: updatedKit });
    }
    catch (err) {
        console.error('Erreur lors de la mise à jour du kit:', err);
        return res.status(500).json({ message: 'Erreur serveur', err });
    }
});
exports.updateKit = updateKit;
const deleteKit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const kitId = parseInt(req.params.kitId);
    if (isNaN(kitId)) {
        return res.status(400).send({ message: 'ID de kit invalide' });
    }
    try {
        const existingKit = yield prismaClient_1.prisma.kit.findUnique({ where: { id: kitId } });
        if (!existingKit || existingKit.userId !== req.userId) {
            return res.status(403).json({ message: 'Non autorisé' });
        }
        yield prismaClient_1.prisma.kit.delete({ where: { id: kitId } });
        return res.status(200).json({ message: 'Kit supprimé avec succès' });
    }
    catch (err) {
        console.error('Erreur lors de la suppression du kit:', err);
        return res.status(500).json({ message: 'Erreur serveur', err });
    }
});
exports.deleteKit = deleteKit;
