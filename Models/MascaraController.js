const express = require("express");
const router = express.Router();

var Mascaras = require("./Mascaras");
var Fabricantes = require("./Fabricantes");
var PartNumbers = require("./Partnumbers");

var formidable = require('formidable');
var fs = require('fs');

const readXlsxFile = require('read-excel-file/node');


router.get("/fabricantes",  (req,res) => {
    
    Fabricantes.findAll().then(fabricantes => {

        PartNumbers.findAll({
            include: Fabricantes
            
        }).then(partnumbers => {
            console.log(partnumbers)
            res.render("fabricantes/index",{
                fabricantes:fabricantes,
                partnumbers:partnumbers,
                erro:""
               
            })
        });
     
    });
    
})


router.post('/fileupload', function(req, res, next){
 
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.path;
      var newpath = 'C:/idw_svn/CheckFeeder Web/files/' + files.filetoupload.name;

      if (files.filetoupload.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){

        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            
           
          });
          readXlsxFile('C:/idw_svn/CheckFeeder Web/files/' + files.filetoupload.name).then((rows) => {
            VinculaPartNumbers(rows,1);
          })
          

          res.redirect("/fabricantes");
            
         
      }else{


        Fabricantes.findAll().then(fabricantes => {

            PartNumbers.findAll({
                include: Fabricantes
                
            }).then(partnumbers => {
                console.log(partnumbers)
                res.render("fabricantes/index",{
                    fabricantes:fabricantes,
                    partnumbers:partnumbers,
                    erro:"Enviar somente arquivos .xlsx"
                   
                })
            });
         
        });

      
      }
      
    });
});


function VinculaPartNumbers(rows,i){


        // `rows` is an array of rows
        // each row being an array of cells.

                console.log("Posição: " + i)
                console.log("Linha: " + rows[i])
                console.log("Buscando: " +  rows[i][24])
               

                Fabricantes.findOne({
                    where:{
                        descricao: rows[i][24]
                    }
                }).then(result => {

                    if(result == null){
                            Fabricantes.create({
                                descricao: rows[i][24],
                                codigo: rows[i][24]                     
                            }).then(fabricante => {
                                console.log( "Novo fabricante " + rows[i][24]  + "  " + rows[i][1])
                                if(rows[i][1] != ""){
                                    PartNumbers.create({
                                        codigo: rows[i][1],
                                        fabricanteId: fabricante.id,
                                     
                                    })
                                }else{
                                    console.log("Código Vazio, operação Cancelada");
                                }
                               
                                
                            })

                            if(i < rows.length-1){
                                setTimeout(function() {
                                    VinculaPartNumbers(rows,i+1)
                                }, 600);
                                
                            }
                            
                           
                        }else{
                            console.log( "fabricante Existente " + rows[i][24]  + "  " + rows[i][1])
                            if(rows[i][1] != ""){
                                PartNumbers.create({
                                    codigo: rows[i][1],
                                    fabricanteId: result.id,
                                 
                                })
                            }else{
                                console.log("Código Vazio, operação Cancelada");
                            }
                            if(i < rows.length-1){
                                setTimeout(function() {
                                    VinculaPartNumbers(rows,i+1)
                                }, 600);
                            }
                        }                       
                })
                
            
     




}



router.get("/maquinaById/:id",  (req,res) => {

    var fabrincnatesId = req.params.id;
    
    Fabricantes.findOne({
        where:{
            id:parseInt(fabrincnatesId)
        }
    }).then(result => {
        res.send(result);
    })
    
})

router.get("/fabricantes/new",  (req,res) => {   

    Fabricantes.findAll().then(maquinas => {
            res.render("fabricantes/index_fab",{
                fabricantes:maquinas
            })
        });
    
})

router.get("/fabricantes/new_fab",  (req,res) => {   

    Fabricantes.findAll().then(maquinas => {
            res.render("fabricantes/new",{
                fabricantes:maquinas
            })
        });
    
})

router.get("/mascaras/new/:id",  (req,res) => {   

    var id = req.params.id;

    res.render("fabricantes/new_masc",{
        fabricanteId:id
    })
    
})

router.post("/fabricantes/create",(req,res) => {
    var descricao = req.body.descricao;
    var codigo = req.body.codigo;    

    Fabricantes.create({
        descricao:descricao,
        codigo: codigo,
     
    }).then(result => {
        res.redirect("/fabricantes/new");
    })
})

router.post("/pastnumber/vinc",(req,res) => {
    var fabricanteId = req.body.fabricantes;
    var qrcodeData = req.body.muverName;    

    PartNumbers.create({
        codigo:qrcodeData,
        fabricanteId: fabricanteId,
     
    }).then(result => {
        res.redirect("/fabricantes");
    })
})



router.post("/mascara/create",(req,res) => {
    var fabricanteId = req.body.id;
    var formato = req.body.formato;
    var divisor = req.body.divisor;    
    var qtdpos = req.body.qtdpos;    
    var reallPos = req.body.reallPos;  
    var partNumberPos = req.body.partNumberPos;  
    var lotePos = req.body.lotePos;  
    

    Mascaras.create({
        formato:formato,
        divisor: divisor,
        quantidadePos: qtdpos,
        reallPos: reallPos,
        partNumberPos: partNumberPos,
        lotePos: lotePos
     
    }).then(result => {

        Fabricantes.update({     

            mascaraId: result.id
        },{
            where:{
                id:fabricanteId
            }
        }).then(() => {
            res.redirect("/fabricantes")
        })

    })
})

router.get("/fabricantes/edit/:id",(req,res) => {

    var id = req.params.id;

    if(isNaN(id)){
        res.redirect("/fabricantes")
    }

    Fabricantes.findByPk(id).then(fabricantes => {

        if(fabricantes != undefined){

            res.render("fabricantes/edit",{
                fabricantes:fabricantes             
              
            })

        }else{
            res.redirect("/fabricantes");
        }

    }).catch(erro => {
        res.redirect("/fabricantes");
    })  

})


router.get("/partnumber/edit/:id",(req,res) => {

    var id = req.params.id;

    if(isNaN(id)){
        res.redirect("/fabricantes")
    }

    PartNumbers.findByPk(id).then(pn => {

        if(pn != undefined){

            Fabricantes.findAll().then(fabricantes => {

                res.render("fabricantes/edit_part",{
                    pn:pn,
                    fabricantes:fabricantes        
                  
                })
            })

          

        }else{
            res.redirect("/fabricantes");
        }

    }).catch(erro => {
        res.redirect("/fabricantes");
    })  

})


router.get("/mascaras/edit/:id",(req,res) => {

    var id = req.params.id;


    Fabricantes.findOne({
        where:{
            id:id
        },
        include:Mascaras
    }).then( fabricante => {

        if(fabricante.mascara == null){    
            res.redirect("/mascaras/new/"+id)
        }else{
            
            res.render("fabricantes/edit_masc",{
                mascara:fabricante.mascara,
                fabricante:fabricante.descricao         
              
            })

        }

    }).catch(erro => {
        res.redirect("/fabricantes");
    }) 

   


})

router.post("/fabricantes/update",(req,res) => {
    
    var descricao = req.body.descricao;
    var codigo = req.body.codigo;
    var id = req.body.id;

    Fabricantes.update({
        descricao:descricao,
        codigo: codigo
    },{
        where:{
            id:id
        }
    }).then(() => {
        res.redirect("/fabricantes")
    })
})

router.post("/pastnumber/update",(req,res) => {
    
    var codigo = req.body.muverName;
    var fabricantes = req.body.fabricantes;
    var id = req.body.id;

    PartNumbers.update({
        fabricantes:fabricantes,
        codigo: codigo
    },{
        where:{
            id:id
        }
    }).then(() => {
        res.redirect("/fabricantes")
    })
})  


router.post("/mascaras/update",(req,res) => {
    
    var id = req.body.id;
    var id_fabricante = req.body.id_fabricante;

    var formato = req.body.formato;
    var divisor = req.body.divisor;    
    var qtdpos = req.body.qtdpos;    
    var reallPos = req.body.reallPos;  
    var partNumberPos = req.body.partNumberPos;  
    var lotePos = req.body.lotePos;  

    Mascaras.update({
        formato:formato,
        divisor: divisor,
        quantidadePos: qtdpos,
        reallPos: reallPos,
        partNumberPos: partNumberPos,
        lotePos: lotePos,
        fabricanteId : id_fabricante
    },{
        where:{
            id:id
        }
    }).then(() => {
        res.redirect("/fabricantes")
    })
})

router.post("/fabricantes/delete",(req,res) => {
    var id = req.body.id;
    if (id != undefined){

        if(!isNaN(id)){

            Fabricantes.destroy({
                where:{
                    id:id
                }
            }).then(() => {
                res.redirect("/fabricantes");
            })

        }else{
            res.redirect("/fabricantes");
        }
    }else{
        res.redirect("/fabricantes");
    }
})


router.post("/partnumber/delete",(req,res) => {
    var id = req.body.id;
    if (id != undefined){

        if(!isNaN(id)){

            PartNumbers.destroy({
                where:{
                    id:id
                }
            }).then(() => {
                res.redirect("/fabricantes");
            })

        }else{
            res.redirect("/fabricantes");
        }
    }else{
        res.redirect("/fabricantes");
    }
})
router.get("/fabricantes",(req,res) => {

    Fabricantes.findAll().then(fabricantes => {
        res.json({fabricantes: fabricantes})
    })

})


module.exports = router;