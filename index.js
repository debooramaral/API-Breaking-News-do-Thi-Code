import express from "express";
// import connectDatabase from "./src/database/db.js";
import connectDatabase2 from "./src/database/db.js";
import dotenv from "dotenv";

import userRoute from "./src/routes/user.route.js";
import authRoute from "./src/routes/auth.route.js";
import newsRoute from "./src/routes/news.route.js";
import swaggerRoute from "./src/routes/swagger.route.js";

dotenv.config();

// ao criarmos a conexão com nosso banco de dados na nuvem, precisamos importar para EXECUTA-LO

// importar a rota aqui, mas precisa ser exportado la
// precisamos importar a rota, pois desmembramos tudo por modulos, tanto a requisição e resposta quanto a função0
//colocamos a rota userRoute que vai estar no user.route, ver o get/post/patch e executar a route em user.controller e retorna para o usuário 'res.send'

// SEMPRE utilizar o que foi instanciado

const port = process.env.PORT || 3000;
const app = express();

connectDatabase2()
// connectDatabase()
app.use(express.json()); //receber arquivos json
app.use("/user", userRoute); 
app.use("/auth", authRoute); 
app.use("/news", newsRoute); 
app.use("/doc", swaggerRoute);

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
 