"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admins_1 = __importDefault(require("./routes/admins"));
const admins_2 = __importDefault(require("./routes/admins"));
const admins_3 = __importDefault(require("./routes/admins"));
const login_1 = __importDefault(require("./routes/login"));
const recuperaSenha_1 = __importDefault(require("./routes/recuperaSenha"));
const validaSenha_1 = __importDefault(require("./routes/validaSenha"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use("/admins", admins_1.default);
app.use("/admins/alunos", admins_2.default);
app.use("/admins/responsaveis", admins_3.default);
app.use("/login", login_1.default);
app.use("/recupera-senha", recuperaSenha_1.default);
app.use("/valida-senha", validaSenha_1.default);
app.get('/', (req, res) => {
    res.send('API - Escola Educação Infantil');
});
app.listen(port, () => {
    console.log(`Servidor rodando na porta: ${port}`);
});
