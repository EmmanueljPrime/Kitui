import { Router } from 'express';
import { getUserKits } from '../controllers/kitController';
import { authenticate } from '../middleware/authenticate';

const router = Router();

router.use(authenticate); // protège toutes les routes de ce fichier

router.get('/:userId/kits', getUserKits);

export default router;
