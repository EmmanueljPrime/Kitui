// 1. Config env
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

import authRoutes from './routes/auth';
import kitAdmin from "./routes/kitAdmin";
import userKitsRouter from "./routes/userKitsRouter";

dotenv.config();

const app = express();

// ✅ Middleware CORS (avant tout)
app.use(cors({
  origin: 'http://localhost:5173', // à adapter si build déployé ailleurs
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ✅ Middleware pour parser les cookies
app.use(cookieParser());

// ✅ Middleware pour parser les JSON
app.use(express.json());

// ✅ Middleware DEBUG des cookies
app.use((req, res, next) => {
  console.log('Token reçu depuis le cookie :', req.cookies?.token);
  next();
});

// === ROUTES API ===
app.use('/api/auth', authRoutes);
app.use('/api/kits', kitAdmin);
app.use('/api/users', userKitsRouter);

// === FRONTEND STATIC SERVE (après les routes API) ===
const __dirnameCurrent = path.resolve(); // important pour ESM
const distPath = path.join(__dirnameCurrent, 'dist');

app.use(express.static(distPath));

// 🎯 Gérer toutes les routes SPA (ex: /kit-editor/1)
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(distPath, 'index.html'));
  }
});

// ✅ Middleware d'erreur global
app.use((err: any, req: Request, res: Response, next: express.NextFunction) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({ message: 'Erreur serveur', error: err.message });
});

// === Lancement du serveur ===
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
