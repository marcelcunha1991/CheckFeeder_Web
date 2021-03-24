const express = require("express");
var cors = require('cors')
const app = express();
const bodyparser = require("body-parser");
const session = require("express-session");

const conn = require("./database/database");

const loginRoutes = require("./Login/LoginRoutes");
const operacoesRoutes = require("./Operacao/OperacaoRouters");
const maquinasRoutes = require("./Maquinas/MaquinaRoutes");
const realimentacaoRoutes = require("./Realimentacao/RealimentacaoRoutes");
const alimentacaoRoutes = require("./Alimentacao/AlimentacaoRoutes");
const identificacaoRoutes = require("./Identificacao/IdentificacaoController");
const MarcarasoRoutes = require("./Models/MascaraController");

const Fabricantes = require("./Models/Fabricantes");
const Mascaras = require("./Models/Mascaras");
const Partnumbers = require("./Models/Partnumbers");

app.use(cors())

require('dotenv/config');


//view engine
app.set('view engine','ejs');


//Session
app.use(session({
    secret: "checkfeeder",
    resave: true,
    saveUninitialized: true,
    cookie:{
        maxAge: 30000
    }

}))


//body parser
app.use(bodyparser.urlencoded({extended: true}))
app.use(bodyparser.json());


//Rotas
app.use("/",loginRoutes);
app.use("/",operacoesRoutes);
app.use("/",maquinasRoutes);
app.use("/",realimentacaoRoutes);
app.use("/",alimentacaoRoutes);
app.use("/", MarcarasoRoutes);
app.use("/",identificacaoRoutes);

//Cria Tabelas
    Mascaras.sync();
    Fabricantes.sync();
    Partnumbers.sync();
  


//static
app.use(express.static('public'));

app.get("/",(req,res) => {
    res.render("login/index")
})


app.listen(3500,"0.0.0.0",() => {
    console.log("Servidor Rodando");
})