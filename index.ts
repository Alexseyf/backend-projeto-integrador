import express from 'express'
import routesAdmins from './routes/admins'
import routesAdminsAlunos from './routes/admins'
import AdminsResponsaveis from './routes/admins'
import routesLogin from './routes/login'
import routesRecuperaSenha from './routes/recuperaSenha'
import routesValidaSenha from './routes/validaSenha'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

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