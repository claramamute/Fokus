const btAddTarefa = document.querySelector('.app__button--add-task');
const formAddTarefa = document.querySelector('.app__form-add-task');
const textarea = document.querySelector('.app__form-textarea');
const ulTarefas = document.querySelector('.app__section-task-list');
const btCancelar = document.querySelector('.app__form-footer__button--cancel');
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description');

const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas');
const btnRemoverTodas = document.querySelector('#btn-remover-todas');


let tarefaSelecionada = null; // registro da tarefa atualmente selecionada
let liTarefaSelecionada = null; // registro da tarefa atualmente selecionada

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

const cancelarTarefa = () =>{
    textarea.value = ''
    formAddTarefa.classList.add('hidden')
}

btCancelar.addEventListener('click', cancelarTarefa);

function atualizarTarefas (){
    localStorage.setItem('tarefas', JSON.stringify(tarefas))
}

function criarElementoTarefa(tarefa) {
    const li = document.createElement('li')
    li.classList.add('app__section-task-list-item')
    
    const svg = document.createElement('svg')
    svg.innerHTML = `
            <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
                <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
                    fill="#01080E"></path>
            </svg>
    `
    const paragrafo = document.createElement('p')
    paragrafo.textContent = tarefa.descricao
    paragrafo.classList.add('app__section-task-list-item-description')
    
    const botao = document.createElement('button')
    botao.classList.add('app_button-edit')

    botao.onclick = () => {
        const novaDescricao = prompt('Faça sua edição')
        if (novaDescricao){
            paragrafo.textContent = novaDescricao
            tarefa.descricao = novaDescricao
            atualizarTarefas()
        }
        
    }
    
    const imagemBotao = document.createElement('img')
    imagemBotao.setAttribute('src', './imagens/edit.png')
    botao.append(imagemBotao)
    
    li.append(svg)
    li.append(paragrafo)
    li.append(botao)
    
    if (tarefa.completa){
        li.classList.add('app__section-task-list-item-complete')
        botao.setAttribute('disabled', 'disabaled')
    } else{
        
        li.onclick = () =>{
            paragrafoDescricaoTarefa.textContent = tarefa.descricao
            document.querySelectorAll('.app__section-task-list-item-active')
                .forEach(elemento => {
                    elemento.classList.remove('app__section-task-list-item-active')
                })
    
            if(tarefaSelecionada == tarefa){
                paragrafoDescricaoTarefa.textContent = ''
                tarefaSelecionada = null
                liTarefaSelecionada = null
                return
            }
    
            tarefaSelecionada = tarefa
            liTarefaSelecionada = li
            li.classList.add('app__section-task-list-item-active')
        }
    }


    return li
}   


btAddTarefa.addEventListener('click' , () => {  //chama função para o formulario aparecer quanod clicar
    formAddTarefa.classList.toggle('hidden')
});

formAddTarefa.addEventListener('submit', (evento) =>{
    evento.preventDefault();
    const tarefa = { //objeto
        descricao : textarea.value // descrição é o valor(conteúdo) doq foi escrito na área de texto 
    }
    tarefas.push(tarefa) //adiciona tarefa na lista
    const elementoTarefa = criarElementoTarefa(tarefa)
    ulTarefas.append(elementoTarefa)
    atualizarTarefas()
    textarea.value = ''
    formAddTarefa.classList.add('hidden')
});

tarefas.forEach (tarefa => {

    const elementoTarefa = criarElementoTarefa(tarefa)
    ulTarefas.append(elementoTarefa)

});

document.addEventListener('focoFinalizado', () =>{
    if ( tarefaSelecionada && liTarefaSelecionada){ //Verifique se existe uma tarefa selecionada
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active')
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete') //Marque essa tarefa como concluída, alterando sua classe
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled') //Desabilite o botão de edição para essa tarefa.
        tarefaSelecionada.completa = true
        atualizarTarefas()
    }
})

const removerTarefas = (somenteConcluidas) => {
    const seletor = somenteConcluidas ? ".app__section-task-list-item-complete" : ".app__section-task-list-item"
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove();
    });
    tarefas = somenteConcluidas ? tarefas.filter(tarefa => !tarefa.completa) : [];
    atualizarTarefas();
}

btnRemoverConcluidas.onclick = () => removerTarefas(true)
btnRemoverTodas.onclick = () => removerTarefas(false)