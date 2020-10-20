const express = require("express");
const router = express.Router();

var soap = require('soap');


router.post("/authenticate",(req,res) => {

    var email = req.body.cdUser;
    console.log(process.env.CFWEBSERVICE);
    var args = {arg0: email};
    
    soap.createClient(process.env.CFWEBSERVICE, function(err, client) {        
        client.getUsuarioCODTO(args, function(err, result) {
            if(result.return.idUsuario != "0"){

                res.redirect("maquinas");
            }
            
        });
    });


})



module.exports = router;