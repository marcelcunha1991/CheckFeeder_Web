const express = require("express");
var cors = require('cors')
const app = express();
const bodyparser = require("body-parser");
const session = require("express-session");


const loginRoutes = require("./Login/LoginRoutes");
const operacoesRoutes = require("./Operacao/OperacaoRouters");
const maquinasRoutes = require("./Maquinas/MaquinaRoutes");
const realimentacaoRoutes = require("./Realimentacao/RealimentacaoRoutes");

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
app.use(bodyparser.urlencoded({extended: false}))
app.use(bodyparser.json());


//Rotas
app.use("/",loginRoutes);
app.use("/",operacoesRoutes);
app.use("/",maquinasRoutes);
app.use("/",realimentacaoRoutes);


//static
app.use(express.static('public'));

app.get("/",(req,res) => {
    res.render("login/index")
})


app.listen(8000,'192.168.0.6',() => {
    console.log("Servidor Rodando");
})