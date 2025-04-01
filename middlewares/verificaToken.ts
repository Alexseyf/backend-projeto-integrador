import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from 'express'

interface TokenI {
  userLogadoId: number
  userLogadoNome: string
  tipoUsuario: string
}

export function verificaToken(req: Request | any, res: Response, next: NextFunction) {
  console.log('=== VerificaToken Middleware ===')
  console.log('URL:', req.url)
  console.log('Método:', req.method)
  console.log('Headers:', JSON.stringify(req.headers, null, 2))
  
  const { authorization } = req.headers

  if (!authorization) {
    console.log('Header Authorization não encontrado')
    return res.status(401).json({ 
      error: "Token não informado",
      headers: req.headers
    })
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

    console.log('Token verificado com sucesso')
    next()
  } catch (error: any) {
    console.log('Erro na verificação do token:', error)
    console.log('Stack trace:', error.stack)
    return res.status(401).json({ 
      error: "Token inválido", 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}