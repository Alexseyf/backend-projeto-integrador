import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"
import { Router } from "express"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

const router = Router()

router.post("/", async (req, res) => {
  const { email, senha } = req.body

  const msg = "Login ou senha incorretos"

  if (!email || !senha) {
    res.status(400).json({ erro: msg })
    return
  }

  try {
    const admin = await prisma.admin.findFirst({
      where: { email },
    })

    if (admin && bcrypt.compareSync(senha, admin.senha)) {
      const token = jwt.sign(
        {
          userLogadoId: admin.id,
          userLogadoNome: admin.nome,
          tipoUsuario: admin.tipoUsuario,
        },
        process.env.JWT_KEY as string,
        { expiresIn: "1h" },
      )

      res.status(200).json({
        id: admin.id,
        nome: admin.nome,
        email: admin.email,
        usuarioTipo: admin.tipoUsuario,
        token,
      })

      await prisma.log.create({
        data: {
          descricao: "Login Realizado",
          complemento: `Funcionário: ${admin.email}`,
          adminId: admin.id,
        },
      })
      return
    }
    const professor = await prisma.professor.findFirst({
      where: { email },
    })

    if (professor && bcrypt.compareSync(senha, professor.senha)) {
      const token = jwt.sign(
        {
          userLogadoId: professor.id,
          userLogadoNome: professor.nome,
          tipoUsuario: professor.tipoUsuario,
        },
        process.env.JWT_KEY as string,
        { expiresIn: "1h" },
      )

      res.status(200).json({
        id: professor.id,
        nome: professor.nome,
        email: professor.email,
        usuarioTipo: professor.tipoUsuario,
        token,
      })
      return
    }
    const responsavel = await prisma.responsavel.findFirst({
      where: { email },
    })

    if (responsavel && bcrypt.compareSync(senha, responsavel.senha)) {
      const token = jwt.sign(
        {
          userLogadoId: responsavel.id,
          userLogadoNome: responsavel.nome,
          tipoUsuario: responsavel.tipoUsuario,
        },
        process.env.JWT_KEY as string,
        { expiresIn: "1h" },
      )

      res.status(200).json({
        id: responsavel.id,
        nome: responsavel.nome,
        email: responsavel.email,
        usuarioTipo: responsavel.tipoUsuario,
        token,
      })
      return
    }
    if (admin) {
      await prisma.log.create({
        data: {
          descricao: "Tentativa de Acesso Inválida",
          complemento: `Funcionário: ${admin.email}`,
          adminId: admin.id,
        },
      })
    }

    res.status(400).json({ erro: msg })
  } catch (error) {
    res.status(400).json(error)
  }
})

export default router
