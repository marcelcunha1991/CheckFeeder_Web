$("#posicao").focus();


function buscaPN(){


    if($("#txtPartumber").val() == ""){
        $.ajax({  
            url:'/fabricantes',  
            method:'get',  
            dataType:'json'

        })
    }else{
        $.ajax({  
            url:'/buscapn/'+$("#txtPartumber").val(),  
            method:'get',  
            dataType:'json',            
            success:function(partNumber){

           
                $("#tblFabricante tr").remove();

                var line = "<tr> <th> Descrição </th> <th> Fabricante </th> </tr>"

                line = line + "<tr> " +
                "<td>" + partNumber.success.codigo + "</td>" +
                "<td>" + partNumber.success.fabricante.descricao + "</td>" +
                "</td>";


                var tableBody = $("#tblFabricante tbody");
                tableBody.append(line);


            }

        })
    }
    
       


}