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
exports.verifyPassword = exports.findUserByUsername = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prismaClient_1 = require("../prismaClient"); // Assure-toi que Prisma Client est bien initialisé
// Fonction pour trouver un utilisateur par son nom d'utilisateur
const findUserByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.prisma.user.findUnique({
        where: { username: username }
    });
});
exports.findUserByUsername = findUserByUsername;
// Fonction pour vérifier le mot de passe avec bcrypt
const verifyPassword = (storedPassword, password) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcryptjs_1.default.compare(password, storedPassword);
});
exports.verifyPassword = verifyPassword;
