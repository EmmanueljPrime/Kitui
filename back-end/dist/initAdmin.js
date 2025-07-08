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
const prismaClient_1 = require("./prismaClient");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const createAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    // Hachage du mot de passe 'admin'
    const hashedPassword = yield bcryptjs_1.default.hash('admin', 10);
    // Création de l'utilisateur 'admin'
    const admin = yield prismaClient_1.prisma.user.create({
        data: {
            username: 'admin',
            password: hashedPassword,
        },
    });
    console.log('Admin user created:', admin);
});
createAdmin()
    .catch((error) => {
    console.error('Error creating admin:', error);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prismaClient_1.prisma.$disconnect();
}));
