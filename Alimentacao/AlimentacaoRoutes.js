const express = require("express");
const router = express.Router();
const leituraCODTO = require("./leituraCODTO.js");
const PosicaoCODTO = require('./posicaoCODTO.js');
const MapaCODTO = require('./mapaCODTO.js');
const usuarioCODTO = require('./usuarioCODTO.js');
const leiturasCODTO = require("./leiturasCODTO.js");
var soap = require('soap');
const axios = require ('axios');
var tipo;

var leituras = []; 
var todasPosicoes;
var maquinaGlobal;
var mapaGlobal;
var userGlobal;

var Mascaras = require("../Models/Mascaras");
var Fabricantes = require("../Models/Fabricantes");
var PartNumbers = require("../Models/Partnumbers");


var url = "http://192.168.0.47:8080";
// var url = "http://192.168.0.13:8081";



router.get("/alimentacao/:maquina/:tipo", (req,res) => {

    todasPosicoes = req.session.posicoes.return.posicoes;

    maquinaGlobal = req.session.maquina,
    mapaGlobal = req.session.cdMapa,
    userGlobal = req.session.userid;
  

    console.log(req.params.tipo);
    console.log(req.params.maquina);
    console.log(req.session.posicoes);
    console.log(req.session.config);

    var maquina = req.params.maquina;

    tipo = req.params.tipo;

    res.render("alimentacao/index",{
        maquina:maquina,
        posicoes: req.session.posicoes.return.posicoes,
        tipo : req.params.tipo
 
    });
    
})


router.get("/getPosicoes", (req,res) => {
    console.log(req.session.posicoes.return.posicoes)

    var response = {
        status  : 200,
        success : req.session.posicoes.return.posicoes
    }

    res.send(JSON.stringify(response))

    
})

router.get("/getPosicoesCount", (req,res) => {
    console.log(req.session.posicoes.return.posicoes.length.toString())
    res.send(req.session.posicoes.return.posicoes.length.toString());
    
})


router.get("/getPosicao/:itemAtual", (req,res) => {
    

    var response = {
        status  : 200,
        success : todasPosicoes[req.params.itemAtual]
    }

    

    res.send(JSON.stringify(response))

    
})

router.get("/chamaFinalizar", (req,res) => {
    console.log("AlimentacaoRouter ");
 

    res.render("alimentacao/finaliza");
})


router.post("/finalizaConferenciaAlim/:status", (req,res) => {
    console.log("Entrou na finalizacao");
    var date = new Date();

    var status = parseInt(req.params.status);

    let dataFormatada = date.getFullYear() +"-"+
    ("0" + (date.getMonth() + 1)).slice(-2)+"-"+
    ("0" + date.getDate()).slice(-2)+" "+
    ("0" + date.getHours()).slice(-2)+ ":"+ 
    ("0" + date.getMinutes()).slice(-2) +":"+
    ("0" + date.getSeconds()).slice(-2);
    
    var data = {
        leituras : leituras,
        cdMaquina : maquinaGlobal,
        cdMapa : mapaGlobal,
        simularAlimentacao : false,
        minDtHrLeitura : 1,
        idUsuario : parseInt(userGlobal),
        isExclusividade : "sim",
        idAlim: 0,
        status : status,
        tpLeitura : parseInt(tipo)
        
    }

    
    console.log(data)
    axios.post(url+"/idw/rest/cfwsr/setconferenciaoupre",data).then(result => {

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

        leituras = [];
        console.log("Resultado s " + JSON.stringify(result, getCircularReplacer()));
        res.redirect("/")
    })
})


router.get("/returnPartNumber/:valorLido",(req,res) => {
    
    var partnumber  = req.params.valorLido;

    PartNumbers.findAll({
        where:{
            codigo: req.params.valorLido
        },
        include:Fabricantes,Mascaras

    }).then(partnumbers =>{

        partnumbers.forEach(pt => {

            Mascaras.findByPk(pt.fabricante.mascaraId).then(mascara => {

             
                if(partnumber.includes(mascara.divisor)){

                    var response = {
                        status  : 200,
                        success : req.params.valorLido.split(mascara.divisor)[mascara.partNumberPos]
                    }                          
        
                    res.send(JSON.stringify(response));
                  
                }               
    
            })

        })
       
    })

})

router.post("/setCorrente", (req,res) => {

    console.log("setCorrente", req);

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
   


    PartNumbers.findOne({
        where:{
            codigo: valorLido
        },
        include:Fabricantes,Mascaras
    }).then(partnumber =>{

        Mascaras.findByPk(partnumber.fabricante.mascaraId).then(mascara => {


        var dados = valorLido.split(mascara.divisor);

        var qtAlimentada = dados[parseInt(mascara.quantidadePos)].replace(/\D/g,'');
        var cbNumeroLote = dados[parseInt(mascara.reallPos)];
        var cbInformacoes = dados[parseInt(mascara.reallPos)];
        var cdProduto = dados[parseInt(mascara.partNumberPos)];

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
            realimentacao: Boolean(false),
            cdLidoProduto: cdProduto,
            cbRap: cbRap,
            idUsuario: parseInt(userGlobal),
            qtAlimentada: parseInt(qtAlimentada),
            conferenciaOuAlimentacao: parseInt(tipo),
            cbInformacoes: cbInformacoes,
            cbNumeroLote: cbNumeroLote
        }

        var data = {
            
            leitura: leitura_,
            cdMaquina: req.body.maquina,
            cdMapa: req.session.cdMapa,
            simularAlimentacao: false,
            minDtHrLeitura: 1,
            idUsuario: parseInt(idUsuario),
            status : 1,
            tpLeitura : parseInt(tipo),
            OK: true
       
        }

        // var data = {
            
        //     filtroleituracorrente:filtroleituracorrente
        // }

        leituras.push(leitura_);

        axios.post(url+"/idw/rest/cfwsr/setcorrente",data).then(result => {

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
            res.send(JSON.stringify(result, getCircularReplacer()));
        })


        })
      
    })


       
})


router.post("/setCorrenteManual", (req,res) => {

    console.log("setCorrenteManual", req);

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
    var quantidade = req.body.quantidade;
    var reelId = req.body.reelId;

    var qtAlimentada = quantidade;
    var cbNumeroLote = reelId
    var cbInformacoes = reelId;
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
            realimentacao: Boolean(false),
            cdLidoProduto: cdProduto,
            cbRap: cbRap,
            idUsuario: parseInt(userGlobal),
            qtAlimentada: parseInt(qtAlimentada),
            conferenciaOuAlimentacao: parseInt(tipo),
            cbInformacoes: cbInformacoes,
            cbNumeroLote: cbNumeroLote
        }

    var data = {
            
            leitura: leitura_,
            cdMaquina: req.body.maquina,
            cdMapa: req.session.cdMapa,
            simularAlimentacao: false,
            minDtHrLeitura: 1,
            idUsuario: parseInt(idUsuario),
            status : 1,
            tpLeitura : parseInt(tipo),
            OK: true
       
        }

        leituras.push(leitura_);

        axios.post(url+"/idw/rest/cfwsr/setcorrente",data).then(result => {

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
            res.send(JSON.stringify(result, getCircularReplacer()));
        })

})


router.post("/checaProdutoAtivo/:cdProduto", (req,res) => {

    var cdProduto = req.params.cdProduto;

    var args = {arg0: cdProduto};


    console.log("Checa Produto");
   
    soap.createClient(process.env.CFWEBSERVICE, function(err, client) {        
        client.getProdutoByCdEStAtivo(args,function(err, result) {     
            
            console.log(result);

            var response = {
                status  : 200,
                success : result
            }

            

            res.send(JSON.stringify(response))


          
         
        });
    })   
    

    
})




module.exports = router;