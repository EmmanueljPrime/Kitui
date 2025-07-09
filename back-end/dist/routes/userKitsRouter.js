"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const kitController_1 = require("../controllers/kitController");
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
router.use(authenticate_1.authenticate); // protège toutes les routes de ce fichier
router.get('/:userId/kits', kitController_1.getUserKits);
exports.default = router;
