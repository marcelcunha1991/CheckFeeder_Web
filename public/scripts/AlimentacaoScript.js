// A $( document ).ready() block.


var posicoes ;
console.log("posicoes : ",posicoes);
var posicaoAtual = 0;
var operacoesRealizadas = 0;
var produtoAtualEsperado;
var leituras = [];
var numeroLeituras = 0;
var cbRap;

var arrayPosicoes;

$.ajax({  
    url:'/getPosicoes',  
    method:'get',  
    dataType:'json',
    success:function(data){ 
    console.log("getPosicoesCount",data.success)
     arrayPosicoes = data.success;
    }
}); 


$.ajax({  
    url:'/getPosicoesCount',  
    method:'get',  
    dataType:'json',
    success:function(data){ 
    console.log("getPosicoesCount",data)
     posicoes = data;
    }
}); 

$.ajax({  
    url:'/getPosicao/'+posicaoAtual,  
    method:'get',  
    dataType:'json',
    success:function(data){
      console.log(data.success)
      produtoAtualEsperado = data.success.cdProduto;
      cbRap = data.success.cdFeeder;
    //   $("#posicao").val(data.cdFeeder);
    //   $('#produtoEsperado').text("Produto Esperado: " +produtoAtualEsperado );
      $('#contador').text(posicaoAtual+1 + " / " + posicoes);
      
    }
}); 

$("#posicao").focus();

$(document).on('keypress',function(e) {   
  
    if(e.which == 13) {   
        console.log("entrando no modo enter")
        if($("#posicao").is($(':focus'))){
            console.log("entrando no modo enter")
            for(var i = 0; i < arrayPosicoes.length; i++){
                console.log(arrayPosicoes[i].cdFeeder)
                console.log($("#cdFeeder").val());
                
                if (arrayPosicoes[i].cdFeeder == $("#posicao").val()){
                    posicaoAtual = i;
                    getPosicao();
                    $("#produto").focus();
                    break;
                }
            }

        }

    }
})
$('#btnAbortar').click(function(e) {  
    
    e.preventDefault();


    if(confirm("Deseja abortar a operação?")){
        $('#btnAbortar').submit()

    }


$("#btnLimpar").click(function(){
    $('#produtoEsperado').text("Produto Esperado: " );
    $('#posicao').val("");
    $('#produto').val("");
    $('#quantidade').val("");
    $('#reelid').val("");
})


    
})
$('#btnAlimentar').click(function() {        

    if (posicaoAtual < posicoes){

        var valorLido = $("#produto").val();
        console.log($("#quantidade").val());
        if($("#quantidade").val() == ""){
            $.ajax({  
                url:'/returnPartNumber/'+valorLido,  
                method:'get',  
                dataType:'json',            
                success:function(partNumber){
    
                    console.log("partNumber " +partNumber.success)
                    
                    $.ajax({  
                        url:'/checaProdutoAtivo/'+ partNumber.success ,  
                        method:'post',  
                        dataType:'json',
                        success:function(data){
    
                        console.log("VEIO "+data.success + " do checa produto");
                          if(data.success.return == true){
                           console.log("Entrou na validacao do checa produto");
               
                            $.ajax({  
                                url:'/getPosicao/'+posicaoAtual,  
                                method:'get',  
                                dataType:'json',
                                success:function(data){
                                   console.log(data.success)
                                   console.log(data.success)
                                    if(data.success.cdProduto == partNumber.success){
                                       console.log("ENTRANDO NO SETCORRENTE");
                                        
                                        $.ajax({  
                                            url:'/setCorrente',  
                                            method:'post',  
                                            dataType:'json',
                                            data:{                                 
                                                maquina: $('#maquina').val(),
                                                produtoAtualEsperado : produtoAtualEsperado,
                                                valorLido: valorLido,
                                                cbRap : cbRap,
                                                indexPosicaoAtual : posicaoAtual                                     
               
               
                                            },success:function(data){
                                                console.log("RESULTADO DA PORRA: ", data)
               
                                                    posicaoAtual = posicaoAtual + 1;
                                                    operacoesRealizadas = operacoesRealizadas + 1;
                                                    
                                                    console.log("Posicao Atual " + posicaoAtual);
               
                                                    if (operacoesRealizadas == posicoes){
                                                       $('#btnFinaliza').submit()
                                                    }else{
                                                       // getPosicao();
                                                       $('#produtoEsperado').text("Produto Esperado: " );
                                                       $('#posicao').val("");
                                                       $('#produto').val("");
                                                       $('#quantidade').val("");
                                                       $('#reelid').val("");
                                                    }                                                                
                                            }
                                           
                                        }); 
                                        
                                    }
                                 
                                },
                                
                            }); 
               
                          }else{
                              alert("Produto Inválido");
                          }
                        }
                    }); 
    
                }
    
            })
        }else{
            $.ajax({  
                url:'/checaProdutoAtivo/'+ valorLido ,  
                method:'post',  
                dataType:'json',
                success:function(data){

                console.log("VEIO "+data.success + " do checa produto");
                  if(data.success.return == true){
                   console.log("Entrou na validacao do checa produto");
       
                    $.ajax({  
                        url:'/getPosicao/'+posicaoAtual,  
                        method:'get',  
                        dataType:'json',
                        success:function(data){
                           console.log(data.success)
                           console.log(data.success)
                            if(data.success.cdProduto == valorLido){
                               console.log("ENTRANDO NO SETCORRENTE");
                                
                                $.ajax({  
                                    url:'/setCorrenteManual',  
                                    method:'post',  
                                    dataType:'json',
                                    data:{                                 
                                        maquina: $('#maquina').val(),
                                        produtoAtualEsperado : produtoAtualEsperado,
                                        valorLido: valorLido,
                                        quantidade:$("#quantidade").val(),
                                        reelId:$("#reelid").val(),
                                        cbRap : cbRap,
                                        indexPosicaoAtual : posicaoAtual                                     
       
       
                                    },success:function(data){
                                        console.log("RESULTADO DA PORRA: ", data)
       
                                            posicaoAtual = posicaoAtual + 1;
                                            operacoesRealizadas = operacoesRealizadas + 1;
                                            
                                            console.log("Posicao Atual " + posicaoAtual);
       
                                            if (operacoesRealizadas == posicoes){
                                               $('#btnFinaliza').submit()
                                            }else{
                                               // getPosicao();
                                               $('#produtoEsperado').text("Produto Esperado: " );
                                               $('#posicao').val("");
                                               $('#produto').val("");
                                               $('#quantidade').val("");
                                               $('#reelid').val("");
                                            }                                                                
                                    }
                                   
                                }); 
                                
                            }
                         
                        },
                        
                    }); 
       
                  }else{
                      alert("Produto Inválido");
                  }
                }
            }); 
        }
       
        


        

        
    }else{

        $.ajax({    
            url:'/chamaFinalizar',  
            method:'post',  
            dataType:'json',     
       
        }); 
    }   

})

function getPosicao(){
    $.ajax({  
        url:'/getPosicao/'+posicaoAtual,  
        method:'get',  
        dataType:'json',
        success:function(data){
            console.log(data.success)
            produtoAtualEsperado = data.success.cdProduto;
            cbRap = data.success.cdFeeder;
            // $("#posicao").val(data.cdFeeder);
            $('#produtoEsperado').text("Produto Esperado: " +produtoAtualEsperado );
            $('#contador').text(posicaoAtual+1 + " / " + posicoes);
        }
    }); 
}

