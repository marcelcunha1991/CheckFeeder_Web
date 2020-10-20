const express = require("express");
const router = express.Router();


router.get("/realimentacao/:maquina", (req,res) => {

    var maquina = req.params.maquina
    res.render("realimentacao/index",{
        maquina:maquina
    });
    
})





module.exports = router;