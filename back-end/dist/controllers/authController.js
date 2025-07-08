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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prismaClient_1 = require("../prismaClient"); // Assure-toi que Prisma Client est correctement importé
// const login = async (req: Request, res: Response): Promise<Response> => {
//     const { username, password } = req.body;
//
//     // Recherche l'utilisateur dans la base de données
//     const user = await prisma.user.findUnique({
//         where: { username }
//     });
//
//     if (!user) {
//         return res.status(400).json({ message: 'Utilisateur non trouvé' });
//     }
//
//     // Vérifie le mot de passe
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//         return res.status(400).json({ message: 'Mot de passe incorrect' });
//     }
//
//     const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
//
//     return res.json({ message: 'Authentification réussie', token });
// };
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        // Recherche l'utilisateur dans la base de données
        const user = yield prismaClient_1.prisma.user.findUnique({
            where: { username }
        });
        if (!user) {
            return res.status(400).json({ message: 'Utilisateur non trouvé' });
        }
        // Vérifie le mot de passe
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Mot de passe incorrect' });
        }
        // Génère le token JWT
        const token = jsonwebtoken_1.default.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ message: 'Authentification réussie', token });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
});
exports.login = login;
