// Funciona no Node.js (prompt-sync) e no navegador (window.prompt).
// Para Node: npm install prompt-sync  |  node script.js
const entrada =
  typeof window !== 'undefined' && typeof window.prompt === 'function'
    ? (msg) => window.prompt(msg) || ''
    : require('prompt-sync')({ sigint: true });

// ============================================================
// 1) Avaliação de Risco de Crédito
// ============================================================
function avaliarRiscoDeCredito(rendaMensal, dividaAtual) {
  const renda = parseFloat(rendaMensal);
  const divida = parseFloat(dividaAtual);

  const te = (divida / renda) * 100;

  if (te < 10) return 'Risco Baixo';
  if (te < 30) return 'Risco Moderado';
  return 'Risco Alto';
}

console.log('--- Questão 1: Avaliação de Risco de Crédito ---');
const rendaMensal = entrada('Informe a renda mensal: ');
const dividaAtual = entrada('Informe a dívida atual: ');
const resultado = avaliarRiscoDeCredito(rendaMensal, dividaAtual);
console.log(`Classificação de crédito: ${resultado}`);

// ============================================================
// 2) Manipulação de array
// ============================================================
console.log('\n--- Questão 2: Manipulação de array ---');
const numeros = [];
while (true) {
  const valor = entrada('Digite um número (ENTER vazio para terminar): ');
  if (valor.trim() === '') break;

  const n = parseFloat(valor);
  if (isNaN(n)) {
    console.log('Valor inválido, tente novamente.');
    continue;
  }
  numeros.push(n);
}

if (numeros.length > 0) {
  // a) Maior e menor
  console.log(`Maior valor: ${Math.max(...numeros)}`);
  console.log(`Menor valor: ${Math.min(...numeros)}`);

  // b) Dobro de cada número
  const dobro = numeros.map((n) => n * 2);
  console.log(`Dobro: ${dobro}`);

  // c) Maiores que 5
  const maioresQue5 = numeros.filter((n) => n > 5);
  console.log(`Números maiores que 5: ${maioresQue5}`);
} else {
  console.log('Nenhum número foi informado.');
}

// ============================================================
// 3) Objeto literal (sem classe)
// ============================================================
console.log('\n--- Questão 3: Objeto carro ---');
const carro = {
  marca: 'Toyota',
  modelo: 'Corolla',
  ano: 2020,
  exibirInfo() {
    console.log(`Marca: ${this.marca} | Modelo: ${this.modelo} | Ano: ${this.ano}`);
  },
};

// a) Chamar o método
carro.exibirInfo();

// b) Nova propriedade
carro.cor = 'Preto';

// c) Atualizar o ano
carro.ano = 2025;

// d) Exibir o objeto completo
console.log(carro);

// ============================================================
// 4) Orientação a Objetos (NÃO OBRIGATÓRIO)
// ============================================================
console.log('\n--- Questão 4: Classe Livro ---');
class Livro {
  constructor(titulo, autor, ano) {
    this.titulo = titulo;
    this.autor = autor;
    this.ano = ano;
  }

  detalhes() {
    console.log(`Livro: ${this.titulo} | Autor: ${this.autor} | Ano: ${this.ano}`);
  }
}

// a) Duas instâncias
const livro1 = new Livro('Dom Casmurro', 'Machado de Assis', 1899);
const livro2 = new Livro('O Hobbit', 'J.R.R. Tolkien', 1937);

// b) Chamar detalhes()
livro1.detalhes();
livro2.detalhes();

// ============================================================
// 5) Laços, condicionais e manipulação de string
// ============================================================
console.log('\n--- Questão 5: Palavra e palíndromo ---');
const palavra = entrada('Informe uma palavra: ').trim();

// a) Quantidade de caracteres
console.log(`A palavra "${palavra}" possui ${palavra.length} caracteres.`);

// b) Palíndromo
const minuscula = palavra.toLowerCase();
const invertida = minuscula.split('').reverse().join('');

if (minuscula === invertida) {
  console.log(`"${palavra}" é um palíndromo.`);
} else {
  console.log(`"${palavra}" não é um palíndromo.`);
}
