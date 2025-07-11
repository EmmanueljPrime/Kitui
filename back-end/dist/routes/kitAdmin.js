"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/kitAdmin.ts
const express_1 = require("express");
const kitController_1 = require("../controllers/kitController");
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
// Appliquer le middleware d'auth à toutes les routes de ce fichier
router.use(authenticate_1.authenticate);
// Route pour afficher les kits
router.get('/', kitController_1.getUserKits);
// Route pour récupérer un kit
router.get('/:id', kitController_1.getKitById);
// Route pour créer un kit
router.post('/', kitController_1.createKit);
// Route pour modifier un kit
router.put('/:id', kitController_1.updateKit);
// Route pour supprimer un kit
router.delete('/:id', kitController_1.deleteKit);
exports.default = router;
