import express from 'express'
import routesAdmins from './routes/admins'
import routesAdminsAlunos from './routes/admins'
import AdminsResponsaveis from './routes/admins'
import routesLogin from './routes/login'
import routesRecuperaSenha from './routes/recuperaSenha'
import routesValidaSenha from './routes/validaSenha'
import cors from 'cors'

const app = express()
const port = 3000

app.use((req, res, next) => {
  next()
})

app.use(cors({
  origin: '*', // Ou defina um domínio específico (ex: 'https://seusite.com')
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Garanta que está listado
  exposedHeaders: ['Authorization'], // Adicione para expor o header
  credentials: true
}))

app.use(express.json())

app.use((req, res, next) => {
  console.log('🔍 Headers recebidos:', req.headers);
  console.log('🔑 Authorization header:', req.headers.authorization);
  next()
})


app.use("/admins", routesAdmins)
app.use("/admins/alunos", routesAdminsAlunos)
app.use("/admins/responsaveis", AdminsResponsaveis)
app.use("/login", routesLogin)
app.use("/recupera-senha", routesRecuperaSenha)
app.use("/valida-senha", routesValidaSenha)

app.get('/', (req, res) => {
  res.send('API - Escola Educação Infantil')
})


app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  console.error('Stack:', err.stack)
  res.status(500).json({ 
    error: 'Algo deu errado!',
    details: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  })
})


if (process.env.NODE_ENV !== 'production') {
  app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000')
  })
}

export default app