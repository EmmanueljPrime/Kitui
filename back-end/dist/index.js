"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const kitAdmin_1 = __importDefault(require("./routes/kitAdmin"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Debug: Vérifier ce que contient authRoutes
console.log("Contenu de authRoutes:", auth_1.default);
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/kit', kitAdmin_1.default);
// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
    console.error('Erreur serveur:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
});
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
