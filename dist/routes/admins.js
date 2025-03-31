"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passwordUtils_1 = require("../utils/passwordUtils");
const client_1 = require("@prisma/client");
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const zod_1 = require("zod");
const verificaToken_1 = require("../middlewares/verificaToken");
const verificaAdmin_1 = require("../middlewares/verificaAdmin");
const client_2 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
const adminSchema = zod_1.z.object({
    nome: zod_1.z.string(),
    email: zod_1.z.string(),
    senha: zod_1.z.string()
});
const alunoSchema = zod_1.z.object({
    nome: zod_1.z.string(),
    dataNasc: zod_1.z.string().date(),
    turma: (0, zod_1.nativeEnum)(client_2.Turma)
});
const responsavelSchema = zod_1.z.object({
    nome: zod_1.z.string(),
    email: zod_1.z.string(),
    senha: zod_1.z.string(),
    telefone: zod_1.z.string()
});
router.get("/", verificaToken_1.verificaToken, verificaAdmin_1.verificaAdmin, async (req, res) => {
    try {
        const admins = await prisma.admin.findMany();
        res.status(200).json(admins);
    }
    catch (error) {
        res.status(400).json(error);
    }
});
router.post("/", verificaToken_1.verificaToken, verificaAdmin_1.verificaAdmin, async (req, res) => {
    const valida = adminSchema.safeParse(req.body);
    if (!valida.success) {
        res.status(400).json({ erro: valida.error });
        return;
    }
    const erros = (0, passwordUtils_1.passwordCheck)(valida.data.senha);
    if (erros.length > 0) {
        res.status(400).json({ erro: erros.join("; ") });
        return;
    }
    const salt = bcrypt_1.default.genSaltSync(12);
    const hash = bcrypt_1.default.hashSync(valida.data.senha, salt);
    try {
        const admin = await prisma.admin.create({
            data: { ...valida.data, senha: hash }
        });
        res.status(201).json(admin);
    }
    catch (error) {
        res.status(400).json(error);
    }
});
router.get("/alunos", async (req, res) => {
    try {
        const alunos = await prisma.aluno.findMany({
            orderBy: { id: "desc" },
            select: {
                id: true,
                nome: true,
                turma: true,
                dataNasc: true,
                createdAt: true
            },
        });
        res.status(200).json(alunos);
    }
    catch (error) {
        res.status(500).json({ erro: error });
    }
});
router.post("/alunos", verificaToken_1.verificaToken, verificaAdmin_1.verificaAdmin, async (req, res) => {
    const valida = alunoSchema.safeParse(req.body);
    if (!valida.success) {
        res.status(400).json({ erro: valida.error });
        return;
    }
    try {
        const aluno = await prisma.aluno.create({
            data: { ...valida.data, dataNasc: valida.data.dataNasc + "T00:00:00Z" }
        });
        res.status(201).json(aluno);
    }
    catch (error) {
        res.status(400).json({ error });
    }
});
router.get("/responsaveis", verificaToken_1.verificaToken, verificaAdmin_1.verificaAdmin, async (req, res) => {
    try {
        const responsaveis = await prisma.responsavel.findMany({
            orderBy: { id: "desc" },
            select: {
                id: true,
                nome: true,
                telefone: true,
                email: true,
                createdAt: true
            },
        });
        res.status(200).json(responsaveis);
    }
    catch (error) {
        res.status(500).json({ erro: error });
    }
});
router.post("/responsaveis", verificaToken_1.verificaToken, verificaAdmin_1.verificaAdmin, async (req, res) => {
    const { nome, email, senha } = req.body;
    const valida = responsavelSchema.safeParse(req.body);
    if (!valida.success) {
        res.status(400).json({ erro: valida.error });
        return;
    }
    const erros = (0, passwordUtils_1.passwordCheck)(valida.data.senha);
    if (erros.length > 0) {
        res.status(400).json({ erro: erros.join("; ") });
        return;
    }
    const salt = bcrypt_1.default.genSaltSync(12);
    const hash = bcrypt_1.default.hashSync(valida.data.senha, salt);
    try {
        const responsavel = await prisma.responsavel.create({
            data: { ...valida.data, senha: hash }
        });
        res.status(201).json(responsavel);
    }
    catch (error) {
        res.status(400).json({ error });
    }
});
exports.default = router;
