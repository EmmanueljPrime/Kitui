import { Router } from 'express';
import { saveKit, getUserKits,updateKit, deleteKit } from '../controllers/kitController';
import { authenticate } from "../middleware/authenticate";

const router = Router();

// @ts-ignore
router.use(authenticate);

//Sauvegarde d'un nouveau kit
// router.post('/save', saveKit)


// Récupérer les kits d'un utilisateur
// router.get('/user/:userId', getUserKits)


// Mise à jour d'un kit
// router.put('/:kitId', updateKit)


// Suppression d'un kit
// router.delete('/:kitId', deleteKit)

export default router;


