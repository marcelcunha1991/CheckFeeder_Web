

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
                dataType:'json'
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

          console.log(data)

          if(data.return == false){
            alert("Relação Máquina e Mapa inválida. Informe máquina e mapa válidos ou procure o administrador do sistema.")
          }else{
            
            $.ajax({  

              url:'/getPosicoesCODTO/'+maquina +"/"+mapa,  
              method:'post',  
              dataType:'json',
              success:function(data) {

                if (data.posicoes == undefined) { 

                  console.log("Mapa vazio. Procure o administrador do sistema.");

                }else{
                  
                  $("#teste").submit()

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



