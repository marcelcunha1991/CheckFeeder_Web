
$(document).on('keypress',function(e) {   

    if(e.which == 13) { 

        if($("#cdComponente").is($(':focus'))){

            console.log($('#cdComponente').val())
            $.ajax({  
                url:'/buscaPosicoes/'+$('#cdComponente').val(),  
                method:'get',  
                dataType:'json',
                success:function(data){
        
                    var posicoes = "" ; 
        
                    for(var i = 0; i < data.success.length; i++){
        
                        posicoes = posicoes + " " +data.success[i].cdFeeder
                    }
        
                    $("#contador").text("Posições: " + posicoes);
                    console.log(data.success)
                  
        
                }
        
            });
        }
    }

});

$("#buscar").click(function(event) {
    event.preventDefault;
    console.log($('#cdComponente').val())
    $.ajax({  
        url:'/buscaPosicoes/'+$('#cdComponente').val(),  
        method:'get',  
        dataType:'json',
        success:function(data){

            var posicoes = "" ; 

            for(var i = 0; i < data.success.length; i++){

                posicoes = posicoes + " " +data.success[i].cdFeeder
            }

            $("#contador").text("Posições: " + posicoes);
            console.log(data.success)
          

        }

    });
       


  });
