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
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3000;
app.use((req, res, next) => {
    next();
});
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization'],
    credentials: true
}));
app.use(express_1.default.json());
app.use((req, res, next) => {
    next();
});
app.use("/admins", admins_1.default);
app.use("/admins/alunos", admins_2.default);
app.use("/admins/responsaveis", admins_3.default);
app.use("/login", login_1.default);
app.use("/recupera-senha", recuperaSenha_1.default);
app.use("/valida-senha", validaSenha_1.default);
app.get('/', (req, res) => {
    res.send('API - Escola Educação Infantil');
});
app.use((err, req, res, next) => {
    console.error('Error:', err);
    console.error('Stack:', err.stack);
    res.status(500).json({
        error: 'Algo deu errado!',
        details: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});
if (process.env.NODE_ENV !== 'production') {
    app.listen(3000, () => {
        console.log('Servidor rodando na porta 3000');
    });
}
exports.default = app;
