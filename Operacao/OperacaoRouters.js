const express = require("express");
const router = express.Router();

var soap = require('soap');


router.get("/operacoes/:maquina", (req,res) => {

    var maquina = req.params.maquina;

    var args = {arg0: maquina};


   
    soap.createClient(process.env.CFWEBSERVICE, function(err, client) {        
        client.getMapasCODTO(args, function(err, result) {
           console.log(result.return.mapas);

           res.render("operacao/index",{
               maquina:maquina,
               mapas: result.return.mapas
           });
            
        });
    })
    
})

router.get("/desalimentacao/:maquina", (req,res) => {

    var maquina = req.params.maquina;

    var args = {arg0: maquina};
 
    soap.createClient(process.env.CFWEBSERVICE, function(err, client) {        
        client.desalimentacao(args, function(err, result) {
                    
        });
    })   

    console.log("Entrou porra");


})


router.post("/isMapaValido/:maquina/:mapa", (req,res) => {

    console.log("valida mapa");
   
    var maquina = req.params.maquina;
    var mapa = req.params.mapa;

    console.log("t",maquina,mapa)

    var args = {arg0: maquina, arg1: mapa};
    
 
    soap.createClient(process.env.CFWEBSERVICE, function(err, client) {        
        client.isMapaValido(args, function(err, result) {

            console.log(result);
            res.send(result)

        });
    })   


})



router.get("/getPosicoesCODTO/:maquina/:mapa", (req,res) => {

    console.log("valida mapa");

    console.log(req.body.teste);
    
    var maquina = req.params.maquina;
    var mapa = req.params.mapa;

    var args = {arg0: maquina,arg1:mapa};    

    soap.createClient(process.env.CFWEBSERVICE, function(err, client) {        
        client.getPosicoesCODTO(args, function(err, result) {

            if(result.posicoes != undefined){
                req.session.posicoes = result.posicoes;
            }

            res.send(result)

        });
    })   


})


module.exports = router;