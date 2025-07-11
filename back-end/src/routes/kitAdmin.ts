// src/routes/kitAdmin.ts
import { Router } from 'express';
import { getUserKits, getKitById, createKit, updateKit, deleteKit } from '../controllers/kitController';
import {authenticate, AuthenticateRequest} from '../middleware/authenticate';

const router = Router();

// Appliquer le middleware d'auth à toutes les routes de ce fichier
router.use(authenticate);

// Route pour afficher les kits
router.get('/', getUserKits);

// Route pour récupérer un kit
router.get('/:id', getKitById);

// Route pour créer un kit
router.post('/', createKit);

// Route pour modifier un kit
router.put('/:id', updateKit);

// Route pour supprimer un kit
router.delete('/:id', deleteKit);

export default router;
