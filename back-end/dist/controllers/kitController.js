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
exports.updateKit = exports.createKit = exports.getKitById = exports.getUserKits = void 0;
const prismaClient_1 = require("../prismaClient");
const getUserKits = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ error: 'Non autorisé' });
            return;
        }
        const kits = yield prismaClient_1.prisma.kit.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json(kits);
    }
    catch (error) {
        console.error("Erreur récupération des kits :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});
exports.getUserKits = getUserKits;
const getKitById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const kitId = parseInt(req.params.id, 10);
        const userId = req.userId;
        if (isNaN(kitId) || !userId) {
            res.status(400).json({ error: 'Paramètres invalides' });
            return;
        }
        const kit = yield prismaClient_1.prisma.kit.findFirst({
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
    }
    catch (err) {
        console.error("Erreur récupération du kit :", err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
exports.getKitById = getKitById;
const createKit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('✅ Données reçues :', req.body);
    const { name, config, isPublic, description, tags } = req.body;
    console.log("✅ Backend : route POST /api/kits appelée");
    if (!name || !config || typeof req.userId !== 'number') {
        res.status(400).json({ error: 'Champs requis manquants' });
        return;
    }
    try {
        const newKit = yield prismaClient_1.prisma.kit.create({
            data: {
                name: name,
                config,
                userId: req.userId,
                isPublic: isPublic !== null && isPublic !== void 0 ? isPublic : false,
                description: description || '',
                tags: Array.isArray(tags) ? tags : [],
            },
        });
        res.status(201).json({ message: 'Kit créé avec succès', kit: newKit });
    }
    catch (err) {
        console.error('Erreur création kit :', err);
        res.status(500).json({ error: 'Erreur serveur', details: err });
    }
});
exports.createKit = createKit;
const updateKit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const kitId = parseInt(req.params.id, 10);
        const { name, description, config, tags, isPublic } = req.body;
        const updatedKit = yield prismaClient_1.prisma.kit.update({
            where: { id: kitId },
            data: { name, description, config, tags, isPublic },
        });
        res.status(200).json(updatedKit);
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour du kit :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});
exports.updateKit = updateKit;
