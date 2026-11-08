# Pokédex: consumindo uma API pública

Atividade de casa de Desenvolvimento Web 2 (IFCE, campus Maranguape).

## API escolhida

- **Nome:** PokéAPI
- **Documentação:** https://pokeapi.co/docs/v2
- **Endpoint usado:** `https://pokeapi.co/api/v2/pokemon/{nome ou número}`
  (exemplo: https://pokeapi.co/api/v2/pokemon/pikachu)

A API é gratuita, não exige chave de acesso, devolve JSON e funciona direto no navegador.

## O que a página faz

- Ao abrir, mostra "Carregando..." e depois o cartão do último Pokémon pesquisado (ou do Pikachu, na primeira vez).
- O campo de busca recebe o nome (em inglês) e faz uma nova requisição.
- O botão "Pokémon aleatório" busca um Pokémon por número sorteado.
- O cartão mostra imagem, nome, número, tipos (traduzidos), altura (em metros) e peso (em kg).
- Se o nome não existir, a página mostra uma mensagem clara. Se faltar internet ou a API falhar, mostra o erro na própria página, e no caso de falha de rede aparece o botão "Tentar de novo".
- O último Pokémon encontrado fica guardado no `localStorage`.

## Conceitos praticados

`fetch` com `async`/`await` (sem `.then`), verificação de `resposta.ok` com `throw new Error`, `try...catch`, criação de elementos com `createElement` e `textContent` (sem `innerHTML`), e funções com uma responsabilidade cada.

## Como abrir

1. Baixe a pasta com `index.html`, `style.css`, `script.js` e `README.md`.
2. Abra o `index.html` no navegador (ou use a extensão Live Server do VS Code).
3. É preciso estar conectado à internet.
