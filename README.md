# 🧠 Quiz Chico - Projeto de Quizzes Interativos
### 📋 Visão Geral
O Quiz Chico é uma plataforma web para criação e realização de quizzes implementador com:

- Frontend em Angular

- Backend em Node.js com Express

- Banco de dados mysql com Sequelize ORM

## 🚀 Como Executar o Projeto Localmente

### 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- Node.js (versão recomendada: 18 ou superior)
- MySQL 8.4 (LTS)
- Angular 19 ou superior

### 📋 Instalação

#### 🔧 Configuração do Banco de Dados

1. Crie um banco de dados no MySQL.

2. Acesse o arquivo de configuração:

```sh
back-quiz/config/config.json
```

3. Altere os dados de conexão (username, password, database) para os dados do seu banco de dados.

#### 🔑 Configuração de Variáveis de Ambiente

1. Crie um arquivo .env dentro da pasta back-quiz/.

2. Adicione as seguintes variáveis:
```sh
PORT=3001
JWT_SECRET=meujwtsecret
JWT_EXPIRES_IN=1d
```
#### 📦 Instalação as dependências do backend
```sh
cd back-quiz
npm install
```
#### ▶️ Executar o Backend
```sh
npm run start
```
#### 🎨 Executar o Frontend
#### 📦 Instalação as dependências do backend
```sh
cd front-quiz
npm install
```
#### ▶️ Executar o Frontend
```sh
ng serve
```


## 🌟 Funcionalidades 

### Usuário 
🔹 RF01: Cadastrar-se no sistema (nome, e-mail e senha)

🔹 RF02: Fazer login e logout

🔹 RF03: Visualizar a lista de quizzes disponíveis

🔹 RF04: Responder quizzes (múltipla escolha)

🔹 RF05: Ver resultado imediato após concluir o quiz

🔹 RF06: Acessar histórico de quizzes realizados e média de desempenho

### Usuário Administrador
🔸 RF07: Login de administrador

🔸 RF08: Criar, editar e excluir quizzes

🔸 RF09: Criar, editar e excluir questões

🔸 RF10: Associar questões aos quizzes
