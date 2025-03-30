import { Request, Response, NextFunction } from "express";
import { TIPO_USUARIO } from "@prisma/client";

interface CustomRequest extends Request {
  userLogadoId?: number
  userLogadoNome?: string
  tipoUsuario?: string
}

export function verificaProfessor(req: CustomRequest, res: Response, next: NextFunction) {
  if (req.tipoUsuario !== TIPO_USUARIO.PROFESSOR) {
    return res.status(403).json({ erro: "Acesso negado. Apenas professores podem acessar." });
  }
  next();
}