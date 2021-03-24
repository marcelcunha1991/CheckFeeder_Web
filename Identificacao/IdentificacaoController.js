const express = require("express");
const router = express.Router();
var soap = require('soap');
const axios = require ('axios');

var todasPosicoes;
var alternativos;

router.get("/identificacao", (req,res) => {

    todasPosicoes = req.session.posicoes.return.posicoes;
  
    alternativos = req.session.posicoesAlt;

    res.render("identificacao/index");
    
})


router.get("/buscaPosicoes/:valorLido", async (req,res) => {
    
    var partnumber;
    var divisor;

    var valorLido = req.params.valorLido;
    
    if(req.session.posicoesAlt != undefined){
        alternativos = req.session.posicoesAlt;
    }
    

    var leitura = req.params.valorLido.split("||");
    
    if(leitura[0].includes(",")){
        partnumber = leitura[0].split(",")
        divisor = ",";
    }else if(leitura[0].includes("@")){
        partnumber = leitura[0].split("@")
        divisor = "@";
    }else if(leitura[0].includes(";")){
        partnumber = leitura[0].split(";")
        divisor = ";";
    }else if(leitura[0].includes("!")){
        partnumber = leitura[0].split("!")
        divisor = "!";
    }else if(leitura[0].includes("#")){
        partnumber = leitura[0].split("#")
        divisor = "#";
    }


    if(partnumber.length == 0){
        var response = {
            status  : 200,
            success : ""
        }                          

        res.send(JSON.stringify(response));

    }else{
        var listaPosicoes = [];

        for(var i = 0; i < partnumber.length;i++){

            let validacao = await validaProdutoAtivo(partnumber[i]);

            if(validacao){
                var componente = partnumber[i];

                for(var j = 0; j < todasPosicoes.length; j++ ){

                    if(todasPosicoes[j].cdProduto == componente ){
                        listaPosicoes.push(todasPosicoes[j]);
                    }
                }

                for(var k = 0; k < alternativos.length; k++ ){

                    if(alternativos[k].cdProduto == componente ){
                        listaPosicoes.push(alternativos[k]);
                    }
                }

            }

        }

        var response = {
            status  : 200,
            success : listaPosicoes
        }            
        
        console.log("Operação concluida com sucesso " + response)
        res.send(JSON.stringify(response));

    }
})

async function validaProdutoAtivo(cdProduto) {
    let args = {arg0: cdProduto};
  
    try {
      let client = await soap.createClientAsync(process.env.CFWEBSERVICE);

      let result = await new Promise((resolve, reject) => {
          client.getProdutoByCdEStAtivo(args, (err, result) => {
              if (err) throw new Error(`Erro no client: ${err}`);
  
              resolve(result.return);
          });
      }).then(value => value);

      return result;
    } catch (error) {
      console.error(error);
    }
}



module.exports = router;