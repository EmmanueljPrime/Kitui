import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth';
import kitAdmin from "./routes/kitAdmin";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Debug: Vérifier ce que contient authRoutes
console.log("Contenu de authRoutes:", authRoutes);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/kit', kitAdmin);

// Gestionnaire d'erreurs global
app.use((err: any, req: Request, res: Response, next: express.NextFunction) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({ message: 'Erreur serveur', error: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});