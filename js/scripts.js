// Elementos
const blocoDeNotas = document.querySelector(".bloco-notas");
const containerBloco = document.querySelector(".container");
const txtBloboDeNotas = document.querySelector(".bloco-notas textarea");
const addBlocoDeNotas = document.querySelector(".add");
const anotarNotas = document.querySelector(".anotar-notes button");
const inputNotas = document.querySelector(".anotar-notes input");
const pesquisarNotas = document.querySelector(".barra-de-pesquisa input");
const exportCSV = document.querySelector(".exportar-csv button");

// Função
function mostrarNotas() {
  limparNotas();

  pegarNotas().forEach((nota) => {
    const elementoNota = criarNota(nota.id, nota.conteudo, nota.fixado);

    containerBloco.appendChild(elementoNota);
  });
}
function limparNotas() {
  containerBloco.innerHTML = "";
}

function addNotas() {
  const notas = pegarNotas();
  const idNotas = {
    id: geradorDeId(),
    conteudo: inputNotas.value,
    fixado: false,
  };

  const elementoNota = criarNota(idNotas.id, idNotas.conteudo);

  containerBloco.appendChild(elementoNota);

  notas.push(idNotas);

  salvarNotas(notas);

  inputNotas.value = "";
}

function geradorDeId() {
  return Math.floor(Math.random() * 5000);
}

function criarNota(id, conteudo, fixado) {
  const divNotas = document.createElement("div");
  divNotas.classList.add("bloco-notas");
  const textarea = document.createElement("textarea");
  textarea.value = conteudo;
  textarea.placeholder = "Adicine algum texto";
  divNotas.appendChild(textarea);

  const imgPin = document.createElement("img");
  imgPin.classList.add("pin");
  imgPin.src = `./img/pin.png`;
  divNotas.appendChild(imgPin);

  const imgCancel = document.createElement("img");
  imgCancel.classList.add("cancel");
  imgCancel.src = `./img/cancel.png`;
  divNotas.appendChild(imgCancel);

  const imgAdd = document.createElement("img");
  imgAdd.classList.add("add");
  imgAdd.src = `./img/add-file.png`;
  divNotas.appendChild(imgAdd);

  if (fixado) {
    divNotas.classList.add("fixado");
  }

  //   Eventos dos Elementos

  divNotas.querySelector("textarea").addEventListener("keyup", (e) => {
    const novoConteudo = e.target.value;

    atualizarNotas(id, novoConteudo);
  });

  imgCancel.addEventListener("click", () => {
    deletarNotas(id, divNotas);
  });

  imgPin.addEventListener("click", () => {
    toggleNotaFixada(id);
  });

  imgAdd.addEventListener("click", () => {
    copiarNota(id);
  });

  return divNotas;
}

function copiarNota(id) {
  const notas = pegarNotas();

  const targetNota = notas.filter((nota) => nota.id == id)[0];

  const novoOjeto = {
    id: geradorDeId(),
    conteudo: targetNota.conteudo,
    fixado: false,
  };

  const elementoNota = criarNota(
    novoOjeto.id,
    novoOjeto.conteudo,
    novoOjeto.fixado
  );

  containerBloco.appendChild(elementoNota);

  notas.push(novoOjeto);

  salvarNotas(notas);
}

function deletarNotas(id, divNotas) {
  const notas = pegarNotas().filter((nota) => nota.id !== id);

  salvarNotas(notas);

  containerBloco.removeChild(divNotas);
}
function toggleNotaFixada(id) {
  const notas = pegarNotas();

  const targetNota = notas.find((nota) => nota.id === id);

  targetNota.fixado = !targetNota.fixado;

  salvarNotas(notas);

  mostrarNotas();
}

function pegarNotas() {
  const notas = JSON.parse(localStorage.getItem("notas") || "[]");

  const ordenarNotas = notas.sort((a, b) => (a.fixado > b.fixado ? -1 : 1));

  return ordenarNotas;
}

function salvarNotas(notas) {
  localStorage.setItem("notas", JSON.stringify(notas));
}

function atualizarNotas(id, novoConteudo) {
  const notas = pegarNotas();

  const targetNota = notas.filter((nota) => nota.id === id)[0];

  targetNota.conteudo = novoConteudo;

  salvarNotas(notas);
}

function procuarNota(procurar) {
  const procurarResultados = pegarNotas().filter((nota) => {
    return nota.conteudo.includes(procurar);
  });

  if (procurar !== "") {
    limparNotas();

    procurarResultados.forEach((nota) => {
      const elementoNota = criarNota(nota.id, nota.conteudo);
      containerBloco.appendChild(elementoNota);
    });

    return;
  }

  limparNotas();

  mostrarNotas();
}

function exportarCSV() {
  const notas = pegarNotas();

  // separa os dado por , quebra a linha \n

  const csvString = [
    ["ID", "Conteudo", "Fixado ?"],
    ...notas.map((nota) => [nota.id, nota.conteudo, nota.fixado]),
  ]
    .map((e) => e.join(","))
    .join("\n");

  const elemento = document.createElement("a");
  elemento.href = "data:text/csv;charset=utf-8," + encodeURI(csvString);

  elemento.target = "_blank";

  elemento.download = "notas.csv";

  elemento.click();
}
// Eventos

anotarNotas.addEventListener("click", () => addNotas());

pesquisarNotas.addEventListener("keyup", (e) => {
  const procurar = e.target.value;

  procuarNota(procurar);
});

inputNotas.addEventListener("keyup", (e) => {
  if (e.key == "Enter") {
    addNotas();
  }
});

exportCSV.addEventListener("click", () => {
  exportarCSV();
});

// iniciar

mostrarNotas();
