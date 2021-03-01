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
  

    console.log(req.session.posicoes.return.posicoes);
    console.log(todasPosicoes);
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
  

    var response = {
        status  : 200,
        success : req.session.posicoes.return.posicoes
    }

    res.send(JSON.stringify(response))

    
})

router.get("/getPosicoesCount", (req,res) => {
   
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

    res.render("alimentacao/finaliza");
})


router.post("/finalizaConferenciaAlim/:status", (req,res) => {
   
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
       
        res.redirect("/")
    })
})


router.get("/returnPartNumber/:valorLido",(req,res) => {
    
    var partnumber;

    if(req.params.valorLido.includes(",")){
        partnumber = req.params.valorLido.split(",")
    }else if(req.params.valorLido.includes("@")){
        partnumber = req.params.valorLido.split("@")
    }else if(req.params.valorLido.includes(";")){
        partnumber = req.params.valorLido.split(";")
    }else if(req.params.valorLido.includes("!")){
        partnumber = req.params.valorLido.split("!")
    }else if(req.params.valorLido.includes("#")){
        partnumber = req.params.valorLido.split("#")
    }


    if(partnumber.length == 0){
        var response = {
            status  : 200,
            success : ""
        }                          

        res.send(JSON.stringify(response));

    }else{

        partnumber.forEach(element => {

            PartNumbers.findAll({
                where:{
                    codigo: element
                },
                include:Fabricantes,Mascaras
        
            }).then(partnumbers =>{
        
                if(partnumbers.length != 0){
                      
                
                        console.log(partnumbers[0]);
                        Mascaras.findByPk(partnumbers[0].fabricante.mascaraId).then(mascara => {            
                         
                            if(req.params.valorLido.includes(mascara.divisor)){
            
                                var response = {
                                    status  : 200,
                                    success : req.params.valorLido.split(mascara.divisor)[mascara.partNumberPos],
                                    qtd: req.params.valorLido.split(mascara.divisor)[mascara.quantidadePos],
                                    lote: req.params.valorLido.split(mascara.divisor)[mascara.lotePos],
                                    reelId: req.params.valorLido.split(mascara.divisor)[mascara.reallPos],
                                }                          
                    
                                res.send(JSON.stringify(response));
                              
                            }               
                
                        })
            
                }
                
               
            })
        })
    }
   

})

router.post("/setCorrente", (req,res) => {

   
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

            res.send(JSON.stringify(result, getCircularReplacer()));
        })

    })


       


router.post("/setCorrenteManual", (req,res) => {

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

            res.send(JSON.stringify(result, getCircularReplacer()));
        })

})


router.post("/checaProdutoAtivo/:cdProduto", (req,res) => {

    var cdProduto = req.params.cdProduto;

    var args = {arg0: cdProduto};
   
    soap.createClient(process.env.CFWEBSERVICE, function(err, client) {        
        client.getProdutoByCdEStAtivo(args,function(err, result) {     

            var response = {
                status  : 200,
                success : result
            }

            

            res.send(JSON.stringify(response))


          
         
        });
    })   
    

    
})




module.exports = router;