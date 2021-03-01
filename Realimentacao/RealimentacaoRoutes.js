const express = require("express");
const router = express.Router();
const axios = require ('axios');

var todasPosicoes;
var maquinaGlobal;
var mapaGlobal;
var userGlobal;
var posicaoAatual;
var leituras = []; 

var Mascaras = require("../Models/Mascaras");
var Fabricantes = require("../Models/Fabricantes");
var PartNumbers = require("../Models/Partnumbers");

var url = "http://192.168.0.47:8080";
// var url = "http://192.168.0.13:8081";



router.get("/voltar",(req,res) =>{
    res.redirect("/operacoes/"+maquinaGlobal)
})


router.get("/realimentacao/:maquina", (req,res) => {

    todasPosicoes = req.session.posicoes.return.posicoes;

    maquinaGlobal = req.session.maquina,
    mapaGlobal = req.session.cdMapa,
    userGlobal = req.session.userid;

    console.log(req.params.tipo);
    console.log(req.params.maquina);
    console.log(req.session.posicoes);
    console.log(req.session.config);

    var maquina = req.params.maquina

    res.render("realimentacao/index",{
        maquina:maquina,
        posicoes: req.session.posicoes.return.posicoes,
    });
    
})


router.get("/getProdutoPosicao", (req,res) => {

    console.log(req.session.posicoes);
    
})

router.get("/pegarindicecomcdfeeder/:cdFeeder", (req,res) => {

    for (var i = 0; i < todasPosicoes.length; i++) {
       
        if(todasPosicoes[i].cdFeeder == req.params.cdFeeder){
            posicaoAtual = todasPosicoes[i];
            return todasPosicoes[i];
        }
        
    }
})


router.post("/setRealimentacao", (req,res) => {

    console.log("setRealimentacao", req);

    var data = new Date();




    let dataFormatada = data.getFullYear() +"-"+
    ("0" + (data.getMonth() + 1)).slice(-2)+"-"+
    ("0" + data.getDate()).slice(-2)+" "+
    ("0" + data.getHours()).slice(-2)+ ":"+ 
    ("0" + data.getMinutes()).slice(-2) +":"+
    ("0" + data.getSeconds()).slice(-2);


    var cbRap = req.body.cbRap;
    var idUsuario =  req.session.userid;
    var isRealimentacao = false;
    var valorLido = req.body.valorLido;

    var qtAlimentada = req.body.qtd.replace(/\D/g,'');
    var cbNumeroLote = req.body.lote;
    var cbInformacoes = req.body.reelId;
    var cdProduto = valorLido;

            var posicaoASerLida = {
                cdFeeder: todasPosicoes[parseInt(req.body.indexPosicaoAtual)].cdFeeder,
                cdRap: cbRap,
                idFeeder : parseInt(todasPosicoes[parseInt(req.body.indexPosicaoAtual)].idFeeder),
                cdProduto : todasPosicoes[parseInt(req.body.indexPosicaoAtual)].cdProduto,
                idProduto : parseInt(todasPosicoes[parseInt(req.body.indexPosicaoAtual)].idProduto),
                desvio : "0",   
                idMapapa: parseInt(todasPosicoes[parseInt(req.body.indexPosicaoAtual)].idMapapa),
                lido: Boolean(todasPosicoes[parseInt(req.body.indexPosicaoAtual)].lido),
                ordem: parseInt(todasPosicoes[parseInt(req.body.indexPosicaoAtual)].ordem),
                autorizado: Boolean(todasPosicoes[parseInt(req.body.indexPosicaoAtual)].autorizado),
                cdMapa: mapaGlobal,
                qtdeConsumidaPorCiclo: 0.001
            }
        
        
            var leitura_ = {
                posicaoASerLida : posicaoASerLida,
                leituraOk: true,
                dthrLeitura: dataFormatada,
                realimentacao: true,
                cdLidoProduto: cdProduto,
                cbRap: cbRap,
                idUsuario: parseInt(userGlobal),
                qtAlimentada: String(qtAlimentada),
                conferenciaOuAlimentacao: 2,
                cbInformacoes: cbInformacoes,
                cbNumeroLote: cbNumeroLote
            }
        
                
            leituras.push(leitura_);
        
            var data = {            
                leituras: leituras,
                cdMaquina: req.body.maquina,
                cdMapa: req.session.cdMapa,
                simularAlimentacao: false,
                minDtHrLeitura: 1,
                idUsuario: parseInt(idUsuario),
                exclusividade :"sim",
                idAlim: 0,
                status : 1   
            }      
        
                axios.post(url+"/idw/rest/cfwsr/setRealimentacao",data).then(result => {
                    leituras = [];
        
                    const getCircularReplacer = () => {
                        const seen = new WeakSet();
                        return (key, value) => {
                          if (typeof value === "object" && value !== null) {
                            if (seen.has(value)) {
                              return;
                            }
                            seen.add(value);
                          }
                          return value;
                        };
                      };
        
                    console.log("Resultado s " + JSON.stringify(result, getCircularReplacer()));
                    // res.send(JSON.stringify(result, getCircularReplacer()));
                    res.redirect("/")
                })

     



    

})

router.get("/getPosicaoRea/:itemAtual", (req,res) => {
    
    res.send(todasPosicoes[req.params.itemAtual])
    
})

module.exports = router;