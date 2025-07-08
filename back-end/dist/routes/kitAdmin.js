"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
// @ts-ignore
router.use(authenticate_1.authenticate);
//Sauvegarde d'un nouveau kit
// router.post('/save', saveKit)
// Récupérer les kits d'un utilisateur
// router.get('/user/:userId', getUserKits)
// Mise à jour d'un kit
// router.put('/:kitId', updateKit)
// Suppression d'un kit
// router.delete('/:kitId', deleteKit)
exports.default = router;
