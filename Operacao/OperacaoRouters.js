const express = require("express");
const router = express.Router();
const posicaoCODTO = require('./posicaoCODTO.js')

var soap = require('soap');

var reqGlobal;


router.get("/operacoes/:maquina", (req,res) => {

    reqGlobal = req;

    var maquina = req.params.maquina;

    var args = {arg0: maquina};

    var args1 = {};


    console.log("Get configuracao");
   
    soap.createClient(process.env.CFWEBSERVICE, function(err, client) {        
        client.getConfiguracaoCheckFeeder(null,function(err, result) {
       
            req.session.config = result;
            console.log("configuracao" , req.session.config);
         
        });
    })   
   
    soap.createClient(process.env.CFWEBSERVICE, function(err, client) {        
        client.getMapasCODTO(args, function(err, result) {

            console.log("MAPAS : ",result)
   
            res.render("operacao/index",{
               maquina:maquina,
               mapas: result.return
           });
            
        });
    })
    
})

router.get("/desalimentacao/:maquina", (req,res) => {

    var maquina = req.params.maquina;

    var args = {arg0: maquina};
 
    soap.createClient(process.env.CFWEBSERVICE, function(err, client) {        
        client.desalimentacao(args, function(err, result) {
            res.send(result)
        });
    })   


})


router.post("/isMapaValido/:maquina/:mapa", (req,res) => {

    console.log("valida mapa");
   
    var maquina = req.params.maquina;
    var mapa = req.params.mapa;

    req.session.maquina = maquina;

    console.log("t",maquina,mapa)

    var args = {arg0: maquina, arg1: mapa.replace(" ","")};
    
    console.log(args)
    soap.createClient(process.env.CFWEBSERVICE, function(err, client) {        
        client.isMapaValido(args, function(err, result) {

            console.log(result);
            
            res.send(result)

        });
    })   


})


router.post("/getPosicoesCODTO/:maquina/:mapa/:isUsarEspelhamento", (req,res) => {

    console.log("Get posicoes");
    
    var maquina = req.params.maquina;
    var mapa = req.params.mapa;
    var isUsarEspelhamento = req.params.isUsarEspelhamento;

    req.session.cdMapa = mapa.replace(" ","");
    
    var args = {arg0: maquina,
                arg1:mapa.replace(" ",""),
                arg2:isUsarEspelhamento};    

    // console.log(args)

    soap.createClient(process.env.CFWEBSERVICE, function(err, client) {        
        client.getPosicoesCODTO(args, function(err, result) {

           
            req.session.posicoes = result;
            console.log("Session",req.session.posicoes.return.posicoes);
           
            res.send(result)

        });
    })   


})



router.post("/validaPosicoes/:maquina/:mapa", (req,res) => {

    console.log("Valiad Posicoes");

    console.log(req);

    
    var posicoes = req.body.po;
    var maquina = req.params.maquina;
    var mapa = req.params.mapa;

    req.session.posicoes = posicoes;

    var listaPos = [];
                posicoes.forEach(element => {

                  var posicaoDTO = new posicaoCODTO(element.autorizado,
                    element.cdFeeder,
                    element.cdMapa,
                    element.cdProduto,
                    element.cdRap,
                    element.desvio,
                    element.idFeeder,
                    element.idMapapa,
                    element.idProduto,
                    element.lido,
                    element.ordem);

                    listaPos.push(posicaoDTO);
                  
                });
             



    var args = {arg0: listaPos,
                arg1:maquina,
                arg2:mapa.replace(" ","")};    

    console.log(args)

    // soap.createClient(process.env.CFWEBSERVICE, function(err, client) {        
    //     client.validaPosicoes(args, function(err, result) {

    //         console.log(result)

    //         if(result.posicoes != undefined){
    //             req.session.posicoes = result.posicoes;
    //         }

    //         res.send(result)

    //     });
    // })   

    soap.createClient(process.env.CFWEBSERVICE, function(err, client) {        
        client.getConfiguracaoCheckFeeder(null,function(err, result) {            

            req.session.config = result;
            console.log("configuracao" , req.session.config);
         
        });
    })   

})



module.exports = router;