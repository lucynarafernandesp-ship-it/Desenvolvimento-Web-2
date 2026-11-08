// ---------- Constantes ----------
const URL_API = "https://pokeapi.co/api/v2/pokemon/";
const CHAVE_ULTIMA_BUSCA = "ultimoPokemon";
const POKEMON_INICIAL = "pikachu";
const TOTAL_POKEMON = 1025;

const NOMES_TIPOS = {
  normal: "Normal",
  fire: "Fogo",
  water: "Água",
  electric: "Elétrico",
  grass: "Planta",
  ice: "Gelo",
  fighting: "Lutador",
  poison: "Veneno",
  ground: "Terra",
  flying: "Voador",
  psychic: "Psíquico",
  bug: "Inseto",
  rock: "Pedra",
  ghost: "Fantasma",
  dragon: "Dragão",
  dark: "Sombrio",
  steel: "Aço",
  fairy: "Fada",
};

// ---------- Elementos da página ----------
const formBusca = document.getElementById("formBusca");
const campoNome = document.getElementById("campoNome");
const botaoBuscar = document.getElementById("botaoBuscar");
const botaoAleatorio = document.getElementById("botaoAleatorio");
const areaStatus = document.getElementById("status");
const areaResultado = document.getElementById("resultado");

// ---------- Estado ----------
let ultimaConsulta = POKEMON_INICIAL;
let carregando = false;

// Erro usado quando a requisição nem chega ao servidor (sem internet, por exemplo).
class ErroDeRede extends Error {}

// ---------- Acesso à API ----------
async function buscarPokemon(consulta) {
  let resposta;
  try {
    resposta = await fetch(URL_API + encodeURIComponent(consulta));
  } catch (erro) {
    throw new ErroDeRede(
      "Não foi possível conectar à PokéAPI. Verifique sua internet e tente de novo."
    );
  }

  if (!resposta.ok) {
    if (resposta.status === 404) {
      throw new Error(
        'Nenhum Pokémon encontrado com o nome "' + consulta + '". Confira a grafia (em inglês) e tente de novo.'
      );
    }
    throw new Error(
      "A PokéAPI respondeu com um erro (código " + resposta.status + "). Tente novamente em instantes."
    );
  }

  return resposta.json();
}

// ---------- Armazenamento ----------
function salvarUltimaBusca(nome) {
  try {
    localStorage.setItem(CHAVE_ULTIMA_BUSCA, nome);
  } catch (erro) {
    // sem armazenamento disponível: a página continua funcionando
  }
}

function lerUltimaBusca() {
  try {
    return localStorage.getItem(CHAVE_ULTIMA_BUSCA) || POKEMON_INICIAL;
  } catch (erro) {
    return POKEMON_INICIAL;
  }
}

// ---------- Formatação ----------
function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function formatarNumero(id) {
  return "#" + String(id).padStart(4, "0");
}

// A API devolve altura em decímetros e peso em hectogramas.
function formatarMedida(valor, unidade) {
  const convertido = valor / 10;
  return (
    convertido.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) +
    " " + unidade
  );
}

function normalizarEntrada(texto) {
  return texto.trim().toLowerCase().replace(/\s+/g, "-");
}

// ---------- Criação dos elementos ----------
function criarImagem(pokemon) {
  const sprite = pokemon.sprites.front_default;
  const arte = pokemon.sprites.other?.["official-artwork"]?.front_default;
  const endereco = sprite || arte;

  if (!endereco) {
    const aviso = document.createElement("p");
    aviso.classList.add("sem-imagem");
    aviso.textContent = "Sem imagem disponível";
    return aviso;
  }

  const img = document.createElement("img");
  img.src = endereco;
  img.alt = "Imagem de " + capitalizar(pokemon.name);
  if (sprite) {
    img.classList.add("sprite");
  }
  return img;
}

function criarListaTipos(tipos) {
  const lista = document.createElement("ul");
  lista.classList.add("tipos");

  tipos.forEach((tipo) => {
    const item = document.createElement("li");
    item.classList.add("tipo", "tipo-" + tipo);
    item.textContent = NOMES_TIPOS[tipo] || capitalizar(tipo);
    lista.appendChild(item);
  });

  return lista;
}

function criarDados(pokemon) {
  const dados = document.createElement("dl");
  dados.classList.add("dados");

  const linhas = [
    ["Altura", formatarMedida(pokemon.height, "m")],
    ["Peso", formatarMedida(pokemon.weight, "kg")],
  ];

  linhas.forEach(([rotulo, valor]) => {
    const dt = document.createElement("dt");
    dt.textContent = rotulo;
    const dd = document.createElement("dd");
    dd.textContent = valor;
    dados.append(dt, dd);
  });

  return dados;
}

function criarCartao(pokemon) {
  const tipos = pokemon.types.map((item) => item.type.name);

  const cartao = document.createElement("article");
  cartao.classList.add("cartao", "tipo-" + tipos[0]);

  const painelImagem = document.createElement("div");
  painelImagem.classList.add("painel-imagem");
  painelImagem.appendChild(criarImagem(pokemon));

  const nome = document.createElement("h2");
  nome.textContent = capitalizar(pokemon.name);

  const numero = document.createElement("p");
  numero.classList.add("numero");
  numero.textContent = formatarNumero(pokemon.id);

  const informacoes = document.createElement("div");
  informacoes.classList.add("informacoes");
  informacoes.append(nome, numero, criarListaTipos(tipos), criarDados(pokemon));

  cartao.append(painelImagem, informacoes);
  return cartao;
}

// ---------- Mensagens na tela ----------
function mostrarStatus(texto, tipo) {
  areaStatus.textContent = "";
  areaStatus.className = "status " + tipo;

  const paragrafo = document.createElement("p");
  paragrafo.textContent = texto;
  areaStatus.appendChild(paragrafo);
}

function limparStatus() {
  areaStatus.textContent = "";
  areaStatus.className = "status";
}

function mostrarErro(erro) {
  mostrarStatus(erro.message, "erro");

  if (erro instanceof ErroDeRede) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.classList.add("botao");
    botao.textContent = "Tentar de novo";
    botao.addEventListener("click", () => carregarPokemon(ultimaConsulta));
    areaStatus.appendChild(botao);
  }
}

function definirCarregando(valor) {
  carregando = valor;
  botaoBuscar.disabled = valor;
  botaoAleatorio.disabled = valor;
}

// ---------- Fluxo principal ----------
async function carregarPokemon(consulta) {
  if (carregando) {
    return;
  }

  ultimaConsulta = consulta;
  definirCarregando(true);
  areaResultado.textContent = "";
  mostrarStatus("Carregando...", "carregando");

  try {
    const pokemon = await buscarPokemon(consulta);
    limparStatus();
    areaResultado.appendChild(criarCartao(pokemon));
    campoNome.value = pokemon.name;
    salvarUltimaBusca(pokemon.name);
  } catch (erro) {
    mostrarErro(erro);
  } finally {
    definirCarregando(false);
  }
}

// ---------- Eventos ----------
formBusca.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const consulta = normalizarEntrada(campoNome.value);

  if (consulta === "") {
    areaResultado.textContent = "";
    mostrarStatus("Digite o nome de um Pokémon para buscar.", "erro");
    return;
  }

  if (!/^[a-z0-9-]+$/.test(consulta)) {
    areaResultado.textContent = "";
    mostrarStatus("Use apenas letras, números e hífen (exemplo: mr-mime).", "erro");
    return;
  }

  carregarPokemon(consulta);
});

botaoAleatorio.addEventListener("click", () => {
  const id = Math.floor(Math.random() * TOTAL_POKEMON) + 1;
  carregarPokemon(id);
});

// ---------- Início ----------
carregarPokemon(lerUltimaBusca());
