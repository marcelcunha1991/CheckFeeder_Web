
var TRATA_PRECONFERENCIA = false;
var posicoes;

$( '#cdMapa' ).focus(function() {

    if ($( '#cdMapa' ).val() == ""){
        alert( "Necessário Preencher o campo Máquina" );
    }else{
        
    }
    
  });


    $('#btnDesalim').click(function() {

        var maquina = $( '#maquina' ).val();    

        
    
        if (confirm("Confirmar desalimentação da Máquina " + maquina)) {
    
            $.ajax({  
                url:'/desalimentacao/'+maquina,  
                method:'get',  
                dataType:'json',
                success:function(data){
                  alert('Desalimentação Com Sucesso.');
                }
            }); 
    
          } else {
    
            alert('Desalimentação cancelada.');
          }
      })



    $('#btnRealimentacao').click(function(e) {
      var maquina = $( '#maquina' ).val(); 
      var mapa = $( "#mapas option:selected" ).text();

      e.preventDefault();

      console.log('/isMapaValido/'+maquina +"/"+mapa)

      $.ajax({  
        url:'/isMapaValido/'+maquina +"/"+mapa,  
        method:'post',          
        dataType:'json',
        success:function(data) {

          console.log("retorno: ",data)

          if(data.return == false){
            alert("Relação Máquina e Mapa inválida. Informe máquina e mapa válidos ou procure o administrador do sistema.")
          }else{
            console.log("Entrou para pegar posições")

            $.ajax({  

              url:'/getPosicoesCODTO/'+maquina +"/"+mapa +"/"+true,  
              method:'post',  
              dataType:'json',
              success:function(data) {

                console.log("POSICPES",data)
                posicoes = data;

                if (data.return.posicoes == undefined) { 

                  console.log("Mapa vazio. Procure o administrador do sistema.");

                }else{
                  
                  $("#btnRealimentacao").submit()

                }
      
               
               
              }
          });

            
          }
          
          console.log("data" , data.return)
        }
    }); 

      // $('#teste').submit();
      
      console.log("submit");
      

    })

    $('#btnAlimentacao').click(function(e) {
      var maquina = $( '#maquina' ).val(); 
      var mapa = $( "#mapas option:selected" ).text();

      e.preventDefault();

      console.log('/isMapaValido/'+maquina +"/"+mapa)

      $.ajax({  
        url:'/isMapaValido/'+maquina +"/"+mapa,  
        method:'post',          
        dataType:'json',
        success:function(data) {

          console.log("retorno: ",data)

          if(data.return == false){
            alert("Relação Máquina e Mapa inválida. Informe máquina e mapa válidos ou procure o administrador do sistema.")
          }else{
            
            var mapaCorrenteParaPT = $("#mapaCorrenteParaPT").val();
     
            console.log("Entrou para pegar posições")

            $.ajax({  

              url:'/getPosicoesCODTO/'+maquina +"/"+mapa +"/"+true,  
              method:'post',  
              dataType:'json',
              success:function(data) {

                console.log("POSICPES",data)
                posicoes = data.return.posicoes;

                if (data.posicoesEspelhadas == true){

                  var r = confirm("Utilizar espelhamento do mapa " + mapa + "?");

                  if (r == true) {
                   
                  } else {
                    $.ajax({  

                      url:'/getPosicoesCODTO/'+maquina +"/"+mapa +"/"+false,  
                      method:'post',  
                      dataType:'json',
                      success:function(data) {
                        posicoes = data.return.posicoes;
                        console.log("POSICPES",data)            
                      
        
                      }
                  });
                  }

                }


                console.log("Posicoes:", posicoes);    


                var r = confirm("Para Alimentar é necessário Desalimentar.\n" +
    "Confirma Desalimentação da máquina para iniciar a Alimentação?");
    console.log($("#maquina").val());

                  if (r == true) {

                    var maquina = $( '#maquina' ).val();    

        
    
        if (confirm("Confirmar desalimentação da Máquina " + maquina)) {

    
            $.ajax({  
                url:'/desalimentacao/'+maquina,  
                method:'get',  
                dataType:'json',
                success:function(data){
                  
                }
            }); 

            $('#btnAlimentacao').submit();
    
          } else {
            
            alert('Desalimentação cancelada.');
          }

          
                   
                  } 


               

              //   $.ajax({  
      
              //     url:'/validaPosicoes/'+maquina +"/"+mapa,  
              //     method:'post',  
              //     data:{po:posicoes},
              //     dataType:'json',
              //     success:function(data) {                   
                  

              //      console.log(data);

              //      $('#teste').submit();
      
      
              //     }
              // });

              }


          });
        
       


            
          }
          
          console.log("data" , data.return)
        }
    }); 

      // $('#teste').submit();
      
      console.log("submit");
      

    })


    $('#btnConferencia').click(function(e) {
      var maquina = $( '#maquina' ).val(); 
      var mapa = $( "#mapas option:selected" ).text();

      e.preventDefault();

      console.log('/isMapaValido/'+maquina +"/"+mapa.replace(" ",""))

      $.ajax({  
        url:'/isMapaValido/'+maquina +"/"+mapa,  
        method:'post',          
        dataType:'json',
        success:function(data) {

          console.log("retorno: ",data)

          if(data.return == false){
            alert("Relação Máquina e Mapa inválida. Informe máquina e mapa válidos ou procure o administrador do sistema.")
          }else{
            
            var mapaCorrenteParaPT = $("#mapaCorrenteParaPT").val();
     
            console.log("Entrou para pegar posições")

            $.ajax({  

              url:'/getPosicoesCODTO/'+maquina +"/"+mapa +"/"+true,  
              method:'post',  
              dataType:'json',
              success:function(data) {

                console.log("POSICPES",data)
                posicoes = data.return.posicoes;

                if (data.posicoesEspelhadas == true){

                  var r = confirm("Utilizar espelhamento do mapa " + mapa + "?");

                  if (r == true) {
                   
                  } else {
                    $.ajax({  

                      url:'/getPosicoesCODTO/'+maquina +"/"+mapa +"/"+false,  
                      method:'post',  
                      dataType:'json',
                      success:function(data) {
                        posicoes = data.return.posicoes;
                        console.log("POSICPES",data)            
                      
                        
        
                      }
                  });
                  }

                }else{
                  $('#btnConferencia').submit();
                }

                console.log("Posicoes:", posicoes);    

              }


          });
    
            
          }
          
          console.log("data" , data.return)
        }
    }); 

      // $('#teste').submit();
      
      console.log("submit");
      

    })


