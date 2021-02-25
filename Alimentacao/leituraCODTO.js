module.exports = class leituraCODTO{

    constructor(posicaoASerLida,isLeituraOk,
        dthrLeitura,isRealimentacao,cdLidoProduto,
        cbRap,idUsuario,qtAlimentada,isConferenciaOuAlimentacao,
        cbInformacoes,cbNumeroLote){

            this.posicaoASerLida = posicaoASerLida;
            this.isLeituraOk = isLeituraOk;
            this.dthrLeitura = dthrLeitura;
            this.isRealimentacao = isRealimentacao;
            this.cdLidoProduto = cdLidoProduto;
            this.cbRap = cbRap;
            this.idUsuario = idUsuario;
            this.qtAlimentada = qtAlimentada;
            this.isConferenciaOuAlimentacao = isConferenciaOuAlimentacao;
            this.cbInformacoes = cbInformacoes;
            this.cbNumeroLote = cbNumeroLote;


        }


}
