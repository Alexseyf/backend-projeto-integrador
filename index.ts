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

// Middleware para debug de headers
app.use((req, res, next) => {
  console.log('Request Headers:', req.headers)
  next()
})

app.use(express.json())

// Configuração mais permissiva do CORS
app.use(cors({
  origin: true, // Permite todas as origens
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Type', 'Authorization']
}))

// Middleware específico para o Vercel
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept')
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

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`)
})