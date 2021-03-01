
contador = 1;
var cbRap;
var produtoAtualEsperado;
var posicoes ;
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

$("#name").focus();

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
                    
                    break;
                }
            }

        }

    }
})

$(document).on('keypress',function(e) {   

    if(e.which == 13) {       

        var valorLido = $("#produto").val();

        const valoresReais = valorLido.replace(";","").split(",");

        if($("#posicao").is($(':focus'))){


            for(var i = 0; i < arrayPosicoes.length; i++){
                console.log(arrayPosicoes[i].cdFeeder)
                console.log($("#cdFeeder").val());
                
                if (arrayPosicoes[i].cdFeeder == $("#posicao").val()){
                    posicaoAtual = i;
                    getPosicao();
                    
                    break;
                }
            }

            $.ajax({  
                url:'/pegarindicecomcdfeeder/'+posicaoAtual,  
                method:'get',  
                dataType:'json',
                success:function(data){            
                    cbRap = data.cdFeeder;
                    produtoAtualEsperado = data.cdProduto;                      
                    $('#produtoEsperado').text("Produto Esperado: " +produtoAtualEsperado );

                },
                
            }); 
        
            $("#produto").focus();
        }else{
            // alert('You pressed enter!');
            // $("#realimentar").submit()

            var valorLido = $("#produto").val();
            const valoresReais = valorLido.replace(";","").split(",");


            $.ajax({  
                url:'/returnPartNumber/'+valorLido,  
                method:'get',  
                dataType:'json',            
                success:function(partNumber){
    
                    console.log("partNumber " + partNumber.success)        
                    console.log("Produto Esperado " + produtoAtualEsperado)    

                    if(produtoAtualEsperado == partNumber.success){
                           
                           console.log("Entrou na validacao do checa produto");
                                                       
                                        $.ajax({  
                                            url:'/setRealimentacao',
                                            method:'post',  
                                            dataType:'json',
                                            data:{                                 
                                                maquina: $('#maquina').val(),
                                                produtoAtualEsperado : produtoAtualEsperado,
                                                valorLido: partNumber.success,
                                                qtd: partNumber.qtd,
                                                lote: partNumber.lote,
                                                reelId: partNumber.reelId,
                                                cbRap : cbRap,
                                                indexPosicaoAtual : posicaoAtual                                     
               
               
                                            },success:function(data){

                                                console.log("RESULTADO DA PORRA da Realimentacao: ", data)                            
                                                
                                                    posicaoAtual = posicaoAtual + 1;                        
                                                    console.log("Posicao Atual " + posicaoAtual);
                            
                                                    if (posicaoAtual+1 > posicoes){
                                                       $('#btnFinaliza').submit()
                                                    }else{
                                                       getPosicao();
                                                    }                                                                
                                            }
                                           
                                        }); 

                }else{
                    alert("Produto inserido não condiz com o esperado");
                }

    
                }
    
            })
         

            contador = contador + 1;

                    $('#contador').text(contador);
                    $('#produtoEsperado').text("Produto Esperado: " );
                    $('#produto').val("");
                    $('#quantidade').val("");
                    $('#reelid').val("");
                    $('#posicao').val("");

            

        }
    }
}); 

$('#btnVoltar').click(function(e) { 
    
    $.ajax({  
        url:'/voltar',  
        method:'get',  
        dataType:'json'        
    }); 
       
})

$("#btnLimpar").click(function(){
    $('#produtoEsperado').text("Produto Esperado: " );
    $('#posicao').val("");
    $('#produto').val("");
    $('#quantidade').val("");
    $('#reelid').val("");
})

function getPosicao(){
    $.ajax({  
        url:'/getPosicaoRea/'+posicaoAtual,  
        method:'get',  
        dataType:'json',
        success:function(data){
            console.log(data)
            produtoAtualEsperado = data.cdProduto;
            cbRap = data.cdFeeder;
            // $("#posicao").val(data.cdFeeder);
            $('#produtoEsperado').text("Produto Esperado: " +produtoAtualEsperado );
           
        }
    }); 
}