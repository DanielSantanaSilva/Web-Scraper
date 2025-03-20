# Code Challenge: Categorização
https://github.com/kingjotaro/challenge01?tab=readme-ov-file



## Sobre o Projeto

Uma aplicação web-scraper que permite aos usuários:
- Capturar informações de produtos em sites de mercado
- Filtrar informações do produtos
- Categorizar esses produtos
- Visualizar uma lista em formato JSON


## Tecnologias Utilizadas

- Node.js
- Express.js
- Puppeteer

## Estrutura do Projeto

```

Web-Scraper/
├── scrapers/
│   ├── carrefour.js
│   ├── coop.js
│   ├── davo.js
│   ├── paodeacucar.js
├── categorize.js
├── server.js
└── package.json

```

## Instalação

### Pré-requisitos
- Node.js (versão 14 ou superior)
- NPM ou Yarn

### Configuração

1. Clone os repositórios
```bash
git clone https://github.com/DanielSantanaSilva/Web-Scraper.git
cd Web-Scraper
```

2. Instale as dependências
```bash
cd Web-Scraper
npm install
```


## Como Executar


1. Inicie o servidor
```bash
cd Web-Scraper
npm start
```

2. Acesse a aplicação em `http://localhost:3000/(produto)`

Exemplo:
http://localhost:3000/produtos?search=Leite Piracanjuba

Sugestão: Utilize alguma ferramenta como Postman para efetuar as requisições


## Desenvolvedor

Daniel Santana Silva
