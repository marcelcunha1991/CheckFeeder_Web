const express = require("express");
const router = express.Router();




router.get("/maquinas", (req,res) => {

    res.render("maquinas/index");
    
})


router.post("/buscaMaquina",(req,res) => {
    
    var maquina = req.body.cdMaquina;
    console.log(maquina);

    res.redirect("operacoes/"+maquina)
   
    });







module.exports = router;