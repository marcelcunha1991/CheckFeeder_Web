const express = require("express");
const router = express.Router();
const axios = require ('axios');

var todasPosicoes;
var maquinaGlobal;
var mapaGlobal;
var userGlobal;
var posicaoAatual;
var leituras = []; 

var soap = require('soap');

var Mascaras = require("../Models/Mascaras");
var Fabricantes = require("../Models/Fabricantes");
var PartNumbers = require("../Models/Partnumbers");

var url = "http://192.168.0.47:8080";
// var url = "http://192.168.0.13:8081";


var alternativos;



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

    alternativos = req.session.posicoesAlt;

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

                    var response = {
                        status  : 200,
                        success : JSON.stringify(result, getCircularReplacer())
                    }                          
            
                    res.send(JSON.stringify(response));
                   // res.redirect("/")
                })

              

})

router.get("/returnPartNumberRealim/:valorLido", (req,res) => {
    
    var partnumber;
    var divisor;
    
    // if(req.session.posicoesAlt != undefined){
    //     alternativos = req.session.posicoesAlt;
    // }   

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

        var position = partnumber.indexOf(leitura[1]);

        if(position != -1){
      
            PartNumbers.findAll({
                where:{
                    codigo: partnumber[position]
                },
                include:[{ all: true, nested: true }]                    
            }).then(async (pt) => {
                if(pt.length != 0){
                    var mascaraCorreta;

                    for (var i = 0; i < pt.length; i++){
                        if (pt[i].fabricante.mascara.partNumberPos == position && 
                            pt[i].fabricante.mascara.divisor == divisor ) {
                            mascaraCorreta = pt[i].fabricante.mascara;
                        }
                    }

                    if(mascaraCorreta != null){
                        let validacao = await validaProdutoAtivo(leitura[1]);

                        if(validacao){
                            var response = {
                                status  : 200,
                                success : leitura[0].split(mascaraCorreta.divisor)[mascaraCorreta.partNumberPos],
                                qtd: leitura[0].split(mascaraCorreta.divisor)[mascaraCorreta.quantidadePos],
                                lote: leitura[0].split(mascaraCorreta.divisor)[mascaraCorreta.lotePos],
                                reelId: leitura[0].split(mascaraCorreta.divisor)[mascaraCorreta.reallPos],
                            }            
                            
                            console.log("Operação concluida com sucesso " + response)
                            res.send(JSON.stringify(response));
                        }
                    }                        
                }
            })
        }else{

            var opcional = null;

            for(var i = 1; i < alternativos.return.posicoes.length;i++){

                if(alternativos.return.posicoes[i].cdFeeder == leitura[2] &&
                    partnumber.indexOf(alternativos.return.posicoes[i].cdProduto) > -1
                 ){
                      
                    opcional = alternativos.return.posicoes[i];
                    console.log("achou opcional");

                }
            }
			console.log("1");
            if(opcional == null){
			console.log("2");
                var response = {
                    status  : 200,
                    success : ""
                }                          
        
                res.send(JSON.stringify(response));

            }else{
				console.log("3");
                var position = partnumber.indexOf(opcional.cdProduto);

                PartNumbers.findAll({
                    where:{
                        codigo: opcional.cdProduto
                    },
                    include:[{ all: true, nested: true }]                    
                }).then(async (pt) => {
					console.log("4");
                    if(pt.length != 0){
						console.log("5");
                        var mascaraCorreta;
						console.log("6");
                        for (var i = 0; i < pt.length; i++){
                            if (pt[i].fabricante.mascara.partNumberPos == position && 
                                pt[i].fabricante.mascara.divisor == divisor ) {

                                mascaraCorreta = pt[i].fabricante.mascara;
                            }
                        }
						console.log("7");
                        if(mascaraCorreta != null){
                            let validacao = await validaProdutoAtivo(opcional.cdProduto);
							console.log("8");
                            if(validacao){
								console.log("9");
                                var response = {
                                    status  : 200,
                                    success : leitura[0].split(mascaraCorreta.divisor)[mascaraCorreta.partNumberPos],
                                    qtd: leitura[0].split(mascaraCorreta.divisor)[mascaraCorreta.quantidadePos],
                                    lote: leitura[0].split(mascaraCorreta.divisor)[mascaraCorreta.lotePos],
                                    reelId: leitura[0].split(mascaraCorreta.divisor)[mascaraCorreta.reallPos],
                                }            

                                console.log("Operação concluida com sucesso " + response)
                                res.send(JSON.stringify(response));
                            }
                        }                        
                    }
                })

            }
            
           
        }
    }
})

router.get("/getPosicaoRea/:itemAtual", (req,res) => {
    
    res.send(todasPosicoes[req.params.itemAtual])
    
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