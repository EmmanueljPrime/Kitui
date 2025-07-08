import { Router, Request, Response } from 'express';
import { login } from '../controllers/authController';

const router = Router();

// Route de login
router.post('/login', async (req: Request, res: Response) => {
    try {
        console.log('Route /login appelée avec body:', req.body);
        await login(req, res);
    } catch (error: any) {
        console.error('Erreur dans la route login:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

// Route de test pour vérifier que le routeur fonctionne
router.get('/test', (_: Request, res: Response) => {
    res.json({ message: 'Le routeur d\'authentification fonctionne' });
});

export default router;