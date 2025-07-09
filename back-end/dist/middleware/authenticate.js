"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token; // ✅ on récupère le token du cookie
    if (!token) {
        console.warn('❌ Token manquant');
        res.status(401).json({ error: 'Token manquant' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log('✅ Token décodé :', decoded);
        req.userId = decoded.userId;
        next();
    }
    catch (err) {
        console.error("Erreur de vérification du token :", err);
        res.status(403).json({ error: 'Token invalide' });
        return;
    }
};
exports.authenticate = authenticate;
