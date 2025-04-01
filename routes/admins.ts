import { passwordCheck } from '../utils/passwordUtils'
import { PrismaClient } from "@prisma/client"
import { Router } from "express"
import bcrypt from 'bcrypt'
import { nativeEnum, z } from 'zod'
import { verificaToken } from '../middlewares/verificaToken'
import { verificaAdmin } from '../middlewares/verificaAdmin'
import { Turma } from '@prisma/client'

const prisma = new PrismaClient()
const router = Router()

const adminSchema = z.object({
  nome: z.string(),
  email: z.string(),
  senha: z.string()
})

const alunoSchema = z.object({
  nome: z.string(),
  dataNasc: z.string().date(),
  turma: nativeEnum(Turma)
})

const responsavelSchema = z.object({
  nome: z.string(),
  email: z.string(),
  senha: z.string(),
  telefone: z.string()
})
  

router.get("/", verificaToken, verificaAdmin, async (req, res) => {
  try {
    const admins = await prisma.admin.findMany()
    res.status(200).json(admins)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.post("/", verificaToken, verificaAdmin, async (req, res) => {
  const valida = adminSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  const erros = passwordCheck(valida.data.senha)
  if (erros.length > 0) {
    res.status(400).json({ erro: erros.join("; ") })
    return
  }

  const salt = bcrypt.genSaltSync(12)
  const hash = bcrypt.hashSync(valida.data.senha, salt)

  try {
    const admin = await prisma.admin.create({
      data: { ...valida.data, senha: hash }
    })
    res.status(201).json(admin)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.get("/alunos", verificaToken, verificaAdmin, async (req, res) => {
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
    })
    res.status(200).json(alunos)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

router.post("/alunos", verificaToken, verificaAdmin,  async (req, res) => {
  const valida = alunoSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }
  try {
    const aluno = await prisma.aluno.create({
      data: { ...valida.data, dataNasc: valida.data.dataNasc + "T00:00:00Z" }
    })
    res.status(201).json(aluno)
  } catch (error) {
    res.status(400).json({ error })
  }
})

router.get("/responsaveis", verificaToken, verificaAdmin, async (req, res) => {
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
    })
    res.status(200).json(responsaveis)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

router.post("/responsaveis", verificaToken, verificaAdmin, async (req, res) => {
  const { nome, email, senha } = req.body
  const valida = responsavelSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }
  const erros = passwordCheck(valida.data.senha)
  if (erros.length > 0) {
    res.status(400).json({ erro: erros.join("; ") })
    return
  }
  const salt = bcrypt.genSaltSync(12)
  const hash = bcrypt.hashSync(valida.data.senha, salt)
  try {
    const responsavel = await prisma.responsavel.create({
      data: { ...valida.data, senha: hash }
    })
    res.status(201).json(responsavel)
  } catch (error) {
    res.status(400).json({ error })
  }
})


export default router