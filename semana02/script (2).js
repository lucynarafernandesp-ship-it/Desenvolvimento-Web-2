// ---------- Constantes ----------
const CHAVE_GASTOS = "gastos";
const CHAVE_ORCAMENTO = "orcamento";

const NOMES_CATEGORIAS = {
  alimentacao: "Alimentação",
  transporte: "Transporte",
  lazer: "Lazer",
  estudos: "Estudos",
  outros: "Outros",
};

// ---------- Elementos da página ----------
const formGasto = document.getElementById("formGasto");
const campoDescricao = document.getElementById("descricao");
const campoValor = document.getElementById("valor");
const campoCategoria = document.getElementById("categoria");
const mensagem = document.getElementById("mensagem");
const totalGeral = document.getElementById("totalGeral");
const vazio = document.getElementById("vazio");
const listaGastos = document.getElementById("listaGastos");

// Bônus
const campoOrcamento = document.getElementById("orcamento");
const avisoOrcamento = document.getElementById("avisoOrcamento");
const filtroCategoria = document.getElementById("filtroCategoria");
const blocoTotalGeral = totalGeral.parentElement;

// ---------- Dados (o "caderno") ----------
let gastos = carregarGastos();
let orcamento = Number(localStorage.getItem(CHAVE_ORCAMENTO)) || 0;

// ---------- Armazenamento ----------
function carregarGastos() {
  try {
    const salvos = JSON.parse(localStorage.getItem(CHAVE_GASTOS));
    return Array.isArray(salvos) ? salvos : [];
  } catch (erro) {
    return [];
  }
}

function salvarGastos() {
  localStorage.setItem(CHAVE_GASTOS, JSON.stringify(gastos));
}

// ---------- Funções auxiliares ----------
function formatarReais(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.classList.remove("erro", "sucesso");
  mensagem.classList.add(tipo);
}

// Devolve o texto do problema, ou "" se estiver tudo certo.
function validarGasto(descricao, textoValor, categoria) {
  if (descricao === "") {
    return "Informe a descrição do gasto.";
  }
  if (textoValor.trim() === "" || Number.isNaN(Number(textoValor))) {
    return "Informe o valor do gasto como um número.";
  }
  if (Number(textoValor) <= 0) {
    return "O valor deve ser maior que zero.";
  }
  if (categoria === "") {
    return "Selecione uma categoria.";
  }
  return "";
}

// ---------- Desenho da tela (a "fotocópia") ----------
function criarCelula(texto) {
  const td = document.createElement("td");
  td.textContent = texto;
  return td;
}

function criarLinha(gasto) {
  const tr = document.createElement("tr");
  tr.dataset.id = gasto.id;

  const tdCategoria = document.createElement("td");
  const badge = document.createElement("span");
  badge.classList.add("badge", gasto.categoria);
  badge.textContent = NOMES_CATEGORIAS[gasto.categoria];
  tdCategoria.appendChild(badge);

  const tdValor = criarCelula(formatarReais(gasto.valor));
  tdValor.classList.add("valor");

  const botao = document.createElement("button");
  botao.type = "button";
  botao.classList.add("remover");
  botao.textContent = "Remover";
  const tdAcao = document.createElement("td");
  tdAcao.appendChild(botao);

  tr.append(criarCelula(gasto.descricao), tdCategoria, tdValor, tdAcao);
  return tr;
}

function desenharTabela() {
  const filtro = filtroCategoria.value;
  const visiveis = gastos.filter(
    (gasto) => filtro === "" || gasto.categoria === filtro
  );

  listaGastos.textContent = "";
  visiveis.forEach((gasto) => listaGastos.appendChild(criarLinha(gasto)));

  vazio.classList.toggle("oculto", visiveis.length > 0);
}

function desenharTotais() {
  const totaisPorCategoria = {};
  Object.keys(NOMES_CATEGORIAS).forEach((categoria) => {
    totaisPorCategoria[categoria] = 0;
  });

  let total = 0;
  gastos.forEach((gasto) => {
    totaisPorCategoria[gasto.categoria] += gasto.valor;
    total += gasto.valor;
  });

  totalGeral.textContent = formatarReais(total);
  Object.keys(totaisPorCategoria).forEach((categoria) => {
    document.getElementById("total-" + categoria).textContent = formatarReais(
      totaisPorCategoria[categoria]
    );
  });

  desenharAlertaOrcamento(total);
}

function desenharAlertaOrcamento(total) {
  const estourou = orcamento > 0 && total > orcamento;
  blocoTotalGeral.classList.toggle("estourou", estourou);
  avisoOrcamento.textContent = estourou
    ? "Atenção: você ultrapassou o orçamento em " +
      formatarReais(total - orcamento) +
      "."
    : "";
}

function desenharTela() {
  desenharTabela();
  desenharTotais();
}

// ---------- Eventos ----------
formGasto.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const descricao = campoDescricao.value.trim();
  const textoValor = campoValor.value;
  const categoria = campoCategoria.value;

  const problema = validarGasto(descricao, textoValor, categoria);
  if (problema !== "") {
    mostrarMensagem(problema, "erro");
    return;
  }

  gastos.push({
    id: Date.now(),
    descricao: descricao,
    // arredonda para centavos: evita erros como 0.1 + 0.2
    valor: Math.round(Number(textoValor) * 100) / 100,
    categoria: categoria,
  });

  salvarGastos();
  desenharTela();
  formGasto.reset();
  campoDescricao.focus();
  mostrarMensagem("Gasto adicionado com sucesso!", "sucesso");
});

// Delegação: um único ouvinte na tabela vale para linhas antigas e novas.
listaGastos.addEventListener("click", (evento) => {
  const botao = evento.target.closest(".remover");
  if (botao === null) {
    return;
  }

  const id = Number(botao.closest("tr").dataset.id);
  gastos = gastos.filter((gasto) => gasto.id !== id);

  salvarGastos();
  desenharTela();
});

filtroCategoria.addEventListener("change", desenharTabela);

campoOrcamento.addEventListener("input", () => {
  orcamento = Number(campoOrcamento.value) || 0;
  localStorage.setItem(CHAVE_ORCAMENTO, orcamento);
  desenharTotais();
});

// ---------- Início ----------
if (orcamento > 0) {
  campoOrcamento.value = orcamento;
}
desenharTela();
