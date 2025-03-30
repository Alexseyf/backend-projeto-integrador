import { Request, Response, NextFunction } from "express";
import { TIPO_USUARIO } from "@prisma/client";

interface CustomRequest extends Request {
  userLogadoId?: number
  userLogadoNome?: string
  tipoUsuario?: string
}

export function verificaAdmin(req: CustomRequest, res: Response, next: NextFunction) {
  if (req.tipoUsuario !== TIPO_USUARIO.ADMIN) {
    return res.status(403).json({ erro: "Acesso negado. Apenas administradores podem acessar." });
  }
  next();
}