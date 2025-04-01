import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from 'express'

interface TokenI {
  userLogadoId: number
  userLogadoNome: string
  tipoUsuario: string
}

export function verificaToken(req: Request | any, res: Response, next: NextFunction) {
  console.log('Headers recebidos:', req.headers)
  console.log('Ambiente:', process.env.NODE_ENV)
  console.log('URL:', req.url)
  
  const { authorization } = req.headers

  if (!authorization) {
    console.log('Header Authorization não encontrado')
    res.status(401).json({ error: "Token não informado" })
    return
  }

  console.log('Authorization header:', authorization)
  const token = authorization.split(" ")[1]
  console.log('Token extraído:', token)
  console.log('JWT_KEY:', process.env.JWT_KEY)

  try {
    const decode = jwt.verify(token, process.env.JWT_KEY as string)
    console.log('Token decodificado:', decode)
    const { userLogadoId, userLogadoNome, tipoUsuario } = decode as TokenI
    req.userLogadoId   = userLogadoId
    req.userLogadoNome = userLogadoNome
    req.tipoUsuario = tipoUsuario;

    next()
  } catch (error: any) {
    console.log('Erro na verificação do token:', error)
    console.log('Stack trace:', error.stack)
    res.status(401).json({ 
      error: "Token inválido", 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}