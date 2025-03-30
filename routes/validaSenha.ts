import express from "express"
import bcrypt from "bcrypt"
import { PrismaClient } from "@prisma/client"
import { passwordCheck } from "../utils/passwordUtils"

const prisma = new PrismaClient()
const router = express.Router()

router.post("/", async (req, res) => {
  const { email, code, novaSenha } = req.body

  if (!email || !code || !novaSenha) {
    return res.status(400).send("Todos os campos devem ser informados")
  }

  const erros = passwordCheck(novaSenha)
  if (erros.length > 0) {
    res.status(400).json({ erro: erros.join("; ") })
    return
  }

  const admin = await prisma.admin.findFirst({
    where: {
      email,
    },
  })

  if (admin) {
    const isSamePassword = await bcrypt.compare(novaSenha, admin.senha)
    if (isSamePassword) {
      return res.status(400).send("A nova senha deve ser diferente da senha atual")
    }

    if (!admin.resetToken) {
      return res.status(400).send("Código inválido ou expirado")
    }

    const isCodeValid = await bcrypt.compare(code, admin.resetToken)
    const isTokenExpired = admin.resetTokenExpires ? new Date() > admin.resetTokenExpires : true

    if (!isCodeValid || isTokenExpired) {
      return res.status(400).send("Código inválido ou expirado")
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(novaSenha, saltRounds)

    await prisma.admin.update({
      where: {
        id: admin.id,
      },
      data: {
        senha: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    })

    return res.status(200).send("Senha alterada com sucesso")
  }

  const professor = await prisma.professor.findFirst({
    where: {
      email,
    },
  })

  if (professor) {
    const isSamePassword = await bcrypt.compare(novaSenha, professor.senha)
    if (isSamePassword) {
      return res.status(400).send("A nova senha deve ser diferente da senha atual")
    }

    if (!professor.resetToken) {
      return res.status(400).send("Código inválido ou expirado")
    }

    const isCodeValid = await bcrypt.compare(code, professor.resetToken)
    const isTokenExpired = professor.resetTokenExpires ? new Date() > professor.resetTokenExpires : true

    if (!isCodeValid || isTokenExpired) {
      return res.status(400).send("Código inválido ou expirado")
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(novaSenha, saltRounds)

    await prisma.professor.update({
      where: {
        id: professor.id,
      },
      data: {
        senha: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    })

    return res.status(200).send("Senha alterada com sucesso")
  }

  const responsavel = await prisma.responsavel.findFirst({
    where: {
      email,
    },
  })

  if (responsavel) {
    const isSamePassword = await bcrypt.compare(novaSenha, responsavel.senha)
    if (isSamePassword) {
      return res.status(400).send("A nova senha deve ser diferente da senha atual")
    }

    if (!responsavel.resetToken) {
      return res.status(400).send("Código inválido ou expirado")
    }

    const isCodeValid = await bcrypt.compare(code, responsavel.resetToken)
    const isTokenExpired = responsavel.resetTokenExpires ? new Date() > responsavel.resetTokenExpires : true

    if (!isCodeValid || isTokenExpired) {
      return res.status(400).send("Código inválido ou expirado")
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(novaSenha, saltRounds)

    await prisma.responsavel.update({
      where: {
        id: responsavel.id,
      },
      data: {
        senha: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    })

    return res.status(200).send("Senha alterada com sucesso")
  }

  return res.status(404).send("Email não encontrado")
})

export default router