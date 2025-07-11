"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
// Route de login
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Route /login appelée avec body:', req.body);
        yield (0, authController_1.login)(req, res);
    }
    catch (error) {
        console.error('Erreur dans la route login:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
}));
// Route de logout
router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // à true en prod
        sameSite: 'lax'
    });
    res.status(200).json({ message: 'Déconnexion réussie' });
});
// Route de test pour vérifier que le routeur fonctionne
router.get('/test', (_, res) => {
    res.json({ message: 'Le routeur d\'authentification fonctionne' });
});
exports.default = router;
