//CRIANDO OBJETO DESPESA e CONFIGURANDO CAPTAÇÃO DELE

class Despesa{
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }
    validarDados(){
        //percorrendo os valores
        for(let i in this){
            if (this[i] == undefined || this[i] == '' || this[i] == null || this.dia > 31) {
                return false
            }
        }
        return true
    }
    
}

class StorageId{
    constructor(){
    //3.0 SETANDO ID INICIAL (id , 0)
        let id = localStorage.getItem('id')

        if( id === null){
            localStorage.setItem('id', 0)
        }
    }

    //2.0 GERANDO UM ID
    getProximoId(){
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId)+1
    }


    //1.0 CONSIGO GRAVAR MAIS OS DADOS SE SOBREPOEM POR NÃO TER UM ID LIGADO AO DADO GRAVADO
    gravarDespesa(d){
        // localStorage.setItem('despesa',JSON.stringify(d))
        //4.0 ALTERANDO ID INICIAL PARA O PROXIMO ID
        let id = this.getProximoId()
        localStorage.setItem(id,JSON.stringify(d))
        // APENAS PRA DEBUG
        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros(){
        //array de despesas
        let despesas = Array()
        let id = localStorage.getItem('id')

        //percorrendo localstorage e armazenando dados numa array
        for (let i = 1; i <= id ; i++){
            // convertendo JSON para JS
            let despesa = JSON.parse(localStorage.getItem(i))
            if (despesa == null) {
                continue
            }
            despesas.push(despesa)
            despesa.id = i
        }
        return despesas
    }

    pesquisar(despesa){
        console.log(despesa)
        let despesasFiltradas = new Array()

        //recuperando valores do localstorage
        despesasFiltradas = this.recuperarTodosRegistros()

        console.log(despesasFiltradas)

        // filtando dados no local storage


        for ( let i in despesa) {
            console.log(despesa[i])
            if (despesa[i] != "") {
             despesasFiltradas = despesasFiltradas.filter( d => d[i] == despesa[i])   
            }
        }

        console.log(despesasFiltradas)
        return despesasFiltradas
    }

    remover(id) {
        localStorage.removeItem(id)
        
    }


}
let storageId = new StorageId()



function cadastrarDespesa() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)

    //VALIDAÇÃO DE DADOS

    if(despesa.validarDados()){
    storageId.gravarDespesa(despesa)
        //dialog de sucesso
        changeModal('success','Registro Inserido', 'Despesa cadastrada com sucesso' )
        $('#modalRegistroDespesa').modal('show')
        $('#modalRegistroDespesa').on('shown.bs.modal', function () {
            $('#btn-modal').trigger('focus')
          })
        limpandoFormualario()       

    } else {
        //dialog de erro
        $('#modalRegistroDespesa').modal('show')
        //corrigindo e configurando autofocus para os modais
        $('#modalRegistroDespesa').on('shown.bs.modal', function () {
            $('#btn-modal').trigger('focus')
          })
    }
}

// -----------------------------------------------------------------

//CARREGANDO DADOS NA PAGINA CONSULTA

function carregarListaDespesas(despesas = Array(), filter = false) {
    if(despesas.length == 0 && filter == false){
        despesas = storageId.recuperarTodosRegistros()
    }
    // console.log(despesas)
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ""
    console.log(despesas)
    despesas.forEach(function(d){
          //criando linha TR
        let linha = listaDespesas.insertRow()

        //criando as colunas TD

        //ajustar dia

        if (parseInt(d.dia) < 10) {
            d.dia = '0' + d.dia
        }

        linha.insertCell(0).innerHTML = `${d.dia}/${(d.mes)}/${d.ano}`
        //ajustando tipo
        switch (d.tipo) {
                case '1': d.tipo = 'Alimentação'
                    break;
                case '2': d.tipo = 'Educação'             
                    break;
                case '3': d.tipo = 'Lazer'               
                    break;
                case '4': d.tipo = 'Saúde'              
                    break;
                case '5': d.tipo = 'Transporte'               
                    break;
            }
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao.toUpperCase()
        linha.insertCell(3).innerHTML = `R$ ${parseFloat(d.valor).toFixed(2)}`

        let btn = document.createElement('button')
        btn.id = `id-button-${d.id}`
        linha.insertCell(4).append(btn)
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class = "fas fa-times"></i>'
        btn.onclick = function(){
            let id = this.id.replace('id-button-','')
            storageId.remover(id)
            carregarListaDespesas()
            changeModal('success','Registro Removido', 'Registro removido com sucesso')
            $('#modalRegistroDespesa').modal('show')
            //corrigindo e configurando autofocus para os modais
            $('#modalRegistroDespesa').on('shown.bs.modal', function () {
                $('#btn-modal').trigger('focus')
              })
        }
    })
}

function pesquisarDespesa(){
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = storageId.pesquisar(despesa)

    carregarListaDespesas(despesas, true)
    if (despesas.length == 0) {
        changeModal('warning','Pesquisa', 'Nenhum resultado encontrado' )
        $('#modalRegistroDespesa').modal('show')
        //corrigindo e configurando autofocus para os modais
        $('#modalRegistroDespesa').on('shown.bs.modal', function () {
            $('#btn-modal').trigger('focus')
          })
        
        limpandoFormualario()
    }

}

function limpandoFormualario( d = ['ano', 'mes', 'dia', 'tipo', 'descricao', 'valor']){
    for (let i = 0; i < d.length; i++) {
        document.getElementById(d[i]).value = ''
    } 
    
}

function changeModal(color,title,mensagem) {
    let modal = document.getElementById('exampleModalLabel')
    let modalBody = document.getElementById('modal-body')
    let buttonModal = document.getElementById('btn-modal')
    modal.className = `modal-title text-${color}`
    buttonModal.className = `btn btn-${color}`
    modal.innerHTML = title
    modalBody.innerHTML = mensagem
}




