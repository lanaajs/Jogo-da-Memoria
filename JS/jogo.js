// Declaração de variáveis para horas (hh), minutos (mm), segundos (ss) e controle do jogo (controle).
var hh = 0;
var mm = 0;
var ss = 0;
var controle = true;

// Variável "tempo" que representa a quantidade de milissegundos em 1 segundo.
var tempo = 1000;
var cron; // Variável para armazenar o identificador do setInterval.
let vitoria = false; // Variável para rastrear se o jogo foi vencido.

// Função "selectPlayerMode" para selecionar o modo de jogador.
function selectPlayerMode(mode) {
  selectedPlayerMode = mode;

  // Obtém elementos de input de nome do jogador 1 e jogador 2.
  const nome1 = document.getElementById("namePlayer1");
  const nome2 = document.getElementById("namePlayer2");

  // Redefine as bordas dos campos de nome para a cor padrão.
  nome1.style.borderColor = "black";
  nome2.style.borderColor = "black";

  if (selectedPlayerMode === 2) {
    nome2.style.display = "block";
    atualizarPlacar(); // Atualiza o placar de acordo com o modo selecionado.
  } else {
    nome2.style.display = "none";
  }
}

// Função "validar" para validar os campos de nome no início do jogo.
function validar() {
  const nome1 = document.getElementById("namePlayer1");
  const nome2 = document.getElementById("namePlayer2");

  // Verifica se ambos os campos de nome estão vazios no modo de 2 jogadores.
  if (selectedPlayerMode === 2) {
    if (nome1.value === "" && nome2.value === "") {
      nome1.style.borderColor = "red";
      nome2.style.borderColor = "red";
    } else if (nome1.value === "") {
      nome1.style.borderColor = "red";
      nome2.style.borderColor = "black"; // Redefine a borda do nome2.
    } else if (nome2.value === "") {
      nome1.style.borderColor = "black"; // Redefine a borda do nome1.
      nome2.style.borderColor = "red";
    } else {
      nome1.style.borderColor = "black";
      nome2.style.borderColor = "black";
      localStorage.setItem("nomeJogador1", nome1.value);
      localStorage.setItem("nomeJogador2", nome2.value);
      window.location = "inicio.html"; // Redireciona para a página "inicio.html".
    }
  } else {
    // No modo de 1 jogador, verifica apenas o campo de nome 1.
    if (nome1.value === "") {
      nome1.style.borderColor = "red";
    } else {
      nome1.style.borderColor = "black";
      localStorage.setItem("nomeJogador1", nome1.value);
      localStorage.removeItem("nomeJogador2"); // Remove o jogador 2
      window.location = "inicio.html"; // Redireciona para a página "inicio.html".
    }
  }
}

// Função "start" para iniciar o temporizador.
function start() {
  // Reinicia o cronômetro zerando horas (hh), minutos (mm) e segundos (ss).
  clearInterval(cron);
  hh = 0;
  mm = 0;
  ss = 0;

  document.getElementById("counter").innerText = "00:00:00"; // Atualiza o contador no HTML.

  // Inicia o cronômetro chamando a função "timer" a cada "tempo" milissegundos.
  cron = setInterval(() => {
    timer();
  }, tempo);
}

// Função "pause" para pausar o temporizador, mas não limpar as variáveis.
function pause() {
  clearInterval(cron);
}

// Função "timer" para fazer a contagem do tempo e atualizar a exibição.
function timer() {
  if (!vitoria) {
    // Verifica se o jogo não foi vencido.
    ss++; // Incrementa os segundos.

    if (ss == 60) {
      ss = 0; // Zera os segundos e incrementa os minutos.
      mm++;

      if (mm == 60) {
        mm = 0; // Zera os minutos e incrementa as horas.
        hh++;
      }
    }

    // Formata as horas, minutos e segundos no formato HH:MM:SS.
    var format =
      (hh < 10 ? "0" + hh : hh) +
      ":" +
      (mm < 10 ? "0" + mm : mm) +
      ":" +
      (ss < 10 ? "0" + ss : ss);

    // Atualiza o valor formatado no elemento com o ID "counter" no HTML.
    document.getElementById("counter").innerText = format;
  }
}

// Event listener que aguarda o carregamento do DOM antes de executar o código dentro dele.
document.addEventListener("DOMContentLoaded", function () {
  const botao_sair = document.getElementById("botao_sair");
  botao_sair.addEventListener("click", sairDaPagina);

  // Obtém nomes de jogador e outras variáveis do armazenamento local.
  let nomeJogador1 = localStorage.getItem("nomeJogador1");
  let nomeJogador2 = localStorage.getItem("nomeJogador2");
  let vezDoJogador1 = true;
  let pontosJogador1 = 0;
  let pontosJogador2 = 0;
  const placar = document.getElementById("placar");

  // Array de imagens que serão usadas para as cartas do jogo.
  const imagens = [
    "IMG/ametista.png",
    "IMG/connie.png",
    "IMG/garnet.png",
    "IMG/lapis.png",
    "IMG/Peridot.png",
    "IMG/perola.png",
    "IMG/rodonita.png",
    "IMG/ruby.png",
    "IMG/safira.png",
    "IMG/steven.png",
  ];

  // Cria um array de cartas duplicando o array de imagens.
  const array_cartas = imagens.concat(imagens);
  let cartas_viradas = []; // Array para rastrear cartas viradas.
  let cartas_iguais = []; // Array para rastrear cartas iguais.

  // Obtém a div que conterá as cartas no HTML.
  const container_cartas = document.getElementById("cartas");
  const botao_restart = document.getElementById("botao_restart"); // Obtém o botão de reinício do jogo no HTML.

  botao_restart.addEventListener("click", restart); // Adiciona um ouvinte de eventos de clique ao botão de reinício e chama a função de reiniciar.

  // Função "verifica" para verificar o jogo single player.
  function verifica() {
    container_cartas.innerHTML = "";
    cartas_viradas = [];
    cartas_iguais = [];
    criar_cartas();
    pause(); // Pára o cronômetro.
    controle = true;
    if (nomeJogador2 == "" || nomeJogador2 == " " || nomeJogador2 == null) {
      document.getElementById("placar").style.display = "none"; // Se houver apenas um jogador, o placar não será exibido.
    }

    if (cartas_iguais.length === array_cartas.length) {
      // Verifica o vencedor quando o jogo termina.
      exibirAlert(`Parabéns, ${nomeJogador2}!\n Você venceu o jogo!`);
    } else {
      // Se as cartas não forem iguais, vira-as de volta.
      carta1.classList.remove("virada"); // Remove a classe "virada" da primeira carta virada para ocultar sua face virada.
      carta2.classList.remove("virada"); // Remove a classe "virada" da segunda carta virada para ocultar sua face virada.
    }
  }
  verifica();

  criar_cartas(); // Chama a função para criar as cartas.

  // Função "criar_cartas" para criar as cartas no jogo.
  function criar_cartas() {
    atualizarPlacar();
    // Embaralha o array de cartas.
    shuffleArray(array_cartas);
    array_cartas.forEach(function (image, index) {
      // Itera sobre o array de cartas e cria elementos HTML para cada carta.
      const carta = document.createElement("div"); // Cria um elemento de div para representar a carta.
      carta.classList.add("carta"); // Adiciona a classe "carta" à div da carta.

      const frente = document.createElement("div"); // Cria um elemento de div para representar a frente da carta.
      frente.classList.add("frente"); // Adiciona a classe "frente" à div da frente.
      const imgFrente = document.createElement("img"); // Cria uma imagem para a frente da carta.
      imgFrente.src = "IMG/logo.png"; // Frente da carta definida no caminho de origem como "logo.png".
      frente.appendChild(imgFrente); // Adiciona a imagem à div da frente da carta.

      const verso = document.createElement("div"); // Cria um elemento de div para representar o verso da carta.
      verso.classList.add("verso"); // Adiciona a classe "verso" à div do verso.
      const imgVerso = document.createElement("img"); // Cria uma imagem para o verso da carta.
      imgVerso.src = image; // Verso da carta definida no caminho de origem com base na imagem fornecida pelo array.
      verso.appendChild(imgVerso); // Adiciona a imagem à div do verso da carta.

      carta.appendChild(frente); // Adiciona a div da frente à div da carta.
      carta.appendChild(verso); // Adiciona a div do verso à div da carta.

      carta.addEventListener("click", virarCarta); // Adiciona um ouvinte de eventos de clique à carta para a função de virar a carta.
      container_cartas.appendChild(carta); // Adiciona a carta ao contêiner de cartas no HTML.
    });
  }

  // Função "virarCarta" para virar uma carta.
  function virarCarta() {
    if (cartas_viradas.length < 2 && !this.classList.contains("virada")) {
      this.classList.add("virada");
      cartas_viradas.push(this);

      if (cartas_viradas.length === 1) {
        if (controle) {
          start(); // Inicia o cronômetro apenas se estiver pausado (controle = true).
          controle = false; // Define controle como false para evitar que o cronômetro seja reiniciado novamente.
        }
      }

      if (cartas_viradas.length === 2) {
        setTimeout(checarIgualdade, 500);
      }
    }
  }

  // Função "checarIgualdade" para verificar se duas cartas viradas são iguais.
  function checarIgualdade() {
    const [carta1, carta2] = cartas_viradas; // Desestrutura o array "cartas_viradas" para ter as duas cartas viradas em "carta1" e "carta2".

    if (
      carta1.querySelector(".verso img").src ===
      carta2.querySelector(".verso img").src
    ) {
      // Se as cartas forem iguais, remove o ouvinte de eventos de clique e as adiciona à lista de cartas iguais.
      carta1.removeEventListener("click", virarCarta); // Remove o ouvinte de evento de clique da primeira carta virada para impedir cliques adicionais.
      carta2.removeEventListener("click", virarCarta); // Remove o ouvinte de evento de clique da segunda carta virada para impedir cliques adicionais.
      cartas_iguais.push(carta1, carta2); // Adiciona as duas cartas viradas à lista de cartas iguais (cartas_iguais).

      if (vezDoJogador1) {
        pontosJogador1 += 10; // Incrementa 10 pontos para o jogador 1 se ele acertar o par.
      } else {
        pontosJogador2 += 10; // Incrementa 10 pontos para o jogador 2 se ele acertar o par.
      }

      atualizarPlacar(); // Atualiza o placar após acertar um par.

      if (cartas_iguais.length === array_cartas.length) {
        verificarVencedor(); // Verifica o vencedor quando o jogo termina.
      }
    } else {
      // Se as cartas não forem iguais, vira-as de volta.
      carta1.classList.remove("virada"); // Remove a classe "virada" da primeira carta virada para ocultar sua face virada.
      carta2.classList.remove("virada"); // Remove a classe "virada" da segunda carta virada para ocultar sua face virada.
      vezDoJogador1 = !vezDoJogador1; // Alterna a vez do jogador apenas quando as cartas forem diferentes.
      atualizarPlacar(); // Atualiza o placar após virar as cartas de volta.
    }

    cartas_viradas = []; // Limpa o array de cartas viradas.
  }

  // Função "restart" para reiniciar o jogo.
  function restart() {
    container_cartas.innerHTML = "";
    cartas_viradas = [];
    cartas_iguais = [];
    criar_cartas();
    pause(); // Pára o cronômetro.
    controle = true;
    pontosJogador1 = 0;
    pontosJogador2 = 0;
    vezDoJogador1 = true;
    atualizarPlacar();
    document.getElementById("counter").innerText = "00:00:00"; // Zera o cronômetro.
  }

  // Função "atualizarPlacar" para atualizar o placar.
  function atualizarPlacar() {
    if (vezDoJogador1) {
      placar.innerText = `${nomeJogador1}: ${pontosJogador1} | ${nomeJogador2}: ${pontosJogador2}`;
    } else {
      placar.innerText = `${nomeJogador2}: ${pontosJogador2} | ${nomeJogador1}: ${pontosJogador1}`;
    }
  }

  // Função para verificar o vencedor
  function verificarVencedor() {
    let vencedor;
    if (pontosJogador1 > pontosJogador2) {
      vencedor = nomeJogador1;
      exibirAlert(`Parabéns, ${vencedor}!\n Você venceu o jogo!`);
      vitoria = true;
    } else if (pontosJogador2 > pontosJogador1) {
      vencedor = nomeJogador2;
      exibirAlert(`Parabéns, ${vencedor}!\n Você venceu o jogo!`);
      vitoria = true;
    } else {
      exibirAlert("Jogo Empatado");
    }

    // Após o clique em "Fechar", chama a função de reinício.
    restart();
  }

  // Função para exibir o alert personalizado
  function exibirAlert(message) {
    const customAlert = document.getElementById("custom-alert");
    const alertMessage = document.getElementById("alert-message");
    alertMessage.textContent = message;
    customAlert.style.display = "block";
  }

  // Função para embaralhar o array.
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Função "sairDaPagina" para redirecionar para a página "index.html".
  function sairDaPagina() {
    window.location.href = "index.html"; // Redireciona para a página "index.html".
  }
});
