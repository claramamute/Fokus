const html = document.querySelector('html');
const foco = document.querySelector('.app__card-button--foco');
const curto = document.querySelector('.app__card-button--curto');
const longo = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const botoes = document.querySelectorAll('.app__card-button');
const startPause = document.querySelector('#start-pause');
const startPauseBt= document.querySelector('#start-pause span');
const imgstartpause = document.querySelector('.app__card-primary-butto-icon');
const printTempo = document.querySelector('#timer');
const musicaInput = document.querySelector('#alternar-musica');
const musica = new Audio('./sons/luna-rise-part-one.mp3');
const audioInicio = new Audio ('./sons/play.wav');
const audioPause = new Audio ('./sons/pause.mp3');
const audioFim = new Audio ('./sons/beep.mp3');

musica.loop = true;

let tempoSegundos = 1500;
let intervalo = null;

musicaInput.addEventListener('change', () =>{
    if (musica.paused){
        musica.play();
    } else{
        musica.pause();
    }
})

foco.addEventListener('click',() =>{
    tempoSegundos = 1500;
    alterarContexto('foco'); // remove a classe 'active' antiga, muda o fundo, imagem e texto 
    foco.classList.add('active'); // adiciona a classe 'active'
})

curto.addEventListener('click', ()=>{
    tempoSegundos = 300;
    alterarContexto('descanso-curto');
    curto.classList.add('active');

})

longo.addEventListener('click', ()=>{
    tempoSegundos = 900;
    alterarContexto('descanso-longo');
    longo.classList.add('active');

})

function alterarContexto(contexto){
    mTempo();
    botoes.forEach(function (contexto){
        contexto.classList.remove('active'); // quando altera o contexto, a classe é removida do que estava
    })
    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `./imagens/${contexto}.png`);
    switch (contexto) {
        case 'foco':
            titulo.innerHTML = `Otimize sua produtividade,<br>
            <strong class="app__title-strong">mergulhe no que importa.</strong>
            `
            break;

        case 'descanso-curto':
            titulo.innerHTML = `Que tal dar uma respirada?
            <strong class="app__title-strong">Faça uma pausa curta!</strong>
            `
            break;

        case 'descanso-longo':
            titulo.innerHTML = `Hora de voltar à superfície.
            <strong class="app__title-strong">Faça uma pausa longa.</strong>
            `
            break;

        default:
            break;
    }
}

const contagem = () =>{
    if(tempoSegundos <= 0){
        audioFim.play();
        zerar();
        alert('Tempo finalizado!');
        const focoAtivo = html.getAttribute('data-contexto' == 'foco');
        if (focoAtivo) {
            const evento = new CustomEvent('focoFinalizado')
            document.dispatchEvent(evento)
        }
        return;
    }
    
    tempoSegundos -= 1;
    mTempo();

}

startPause.addEventListener('click', inciarPausar);

function inciarPausar(){
    if(intervalo){
        audioPause.play();
        zerar();
        return;
    }
    audioInicio.play();
    intervalo = setInterval(contagem, 1000);
    startPauseBt.textContent = "Pausar";
    imgstartpause.setAttribute('src', './imagens/pause.png');
}

function zerar (){
    startPauseBt.textContent = "Começar";
    imgstartpause.setAttribute('src', './imagens/play_arrow.png');
    clearInterval(intervalo);
    intervalo= null;
}


function mTempo (){
    const tempo = new Date(tempoSegundos*1000);
    const tempoNovo = tempo.toLocaleTimeString('pt-Br', {minute: '2-digit', second: '2-digit'} );
    printTempo.innerHTML = `${tempoNovo}`
}

mTempo();