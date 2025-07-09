"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 1. Config env
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const auth_1 = __importDefault(require("./routes/auth"));
const kitAdmin_1 = __importDefault(require("./routes/kitAdmin"));
const userKitsRouter_1 = __importDefault(require("./routes/userKitsRouter"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// ✅ Middleware CORS (avant tout)
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173', // à adapter si build déployé ailleurs
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// ✅ Middleware pour parser les cookies
app.use((0, cookie_parser_1.default)());
// ✅ Middleware pour parser les JSON
app.use(express_1.default.json());
// ✅ Middleware DEBUG des cookies
app.use((req, res, next) => {
    var _a;
    console.log('Token reçu depuis le cookie :', (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token);
    next();
});
// === ROUTES API ===
app.use('/api/auth', auth_1.default);
app.use('/api/kits', kitAdmin_1.default);
app.use('/api/users', userKitsRouter_1.default);
// === FRONTEND STATIC SERVE (après les routes API) ===
const __dirnameCurrent = path_1.default.resolve(); // important pour ESM
const distPath = path_1.default.join(__dirnameCurrent, 'dist');
app.use(express_1.default.static(distPath));
// 🎯 Gérer toutes les routes SPA (ex: /kit-editor/1)
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path_1.default.join(distPath, 'index.html'));
    }
});
// ✅ Middleware d'erreur global
app.use((err, req, res, next) => {
    console.error('Erreur serveur:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
});
// === Lancement du serveur ===
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
});
