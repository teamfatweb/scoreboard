"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = global.prisma || new client_1.PrismaClient();
global.prisma = prisma;
exports.default = prisma;
