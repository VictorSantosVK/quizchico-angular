
-----

# Aplicação de Quiz Angular

Este projeto é uma aplicação de quiz interativa construída com **Angular**, projetada para oferecer uma experiência de usuário envolvente para a realização de quizzes.

-----

## Configuração do Projeto

Para colocar este projeto em funcionamento em sua máquina local, siga os passos abaixo:

### 1\. Clonar o Repositório

Primeiro, clone o repositório do projeto para sua máquina local usando o Git:

```bash
git clone https://github.com/VictorSantosVK/quizchico-angular.git
```

Navegue até o diretório clonado:

```bash
cd quizchico-angular
```

### 2\. Requisitos de Versão do Node.js

Este projeto exige uma versão específica do Node.js para funcionar corretamente com o Angular CLI.

  * **Versão do Node.js Necessária:** `v20.19` ou `v22.12` (ou superior nas linhas LTS v20.x ou v22.x)

**Importante:** Se sua versão do Node.js for mais antiga que `v20.19`, você precisará atualizá-la. Você pode usar uma ferramenta como `nvm` (Node Version Manager) para alternar facilmente entre as versões do Node.js.

Para instalar o `nvm`, siga as instruções na [página do GitHub](https://github.com/nvm-sh/nvm). Uma vez que o `nvm` estiver instalado, você pode instalar e usar a versão necessária do Node.js:

```bash
nvm install 20.19
nvm use 20.19
# Ou para v22.12
# nvm install 22.12
# nvm use 22.12
```

Verifique sua versão do Node.js após a atualização:

```bash
node -v
```

### 3\. Instalar Dependências

Estando no diretório do projeto e com a versão correta do Node.js, instale os pacotes npm necessários:

```bash
npm install
```

### 4\. Rodar a Aplicação

Após instalar as dependências, você pode iniciar o servidor de desenvolvimento Angular:

```bash
ng serve
```

Este comando irá compilar a aplicação e iniciar um servidor de desenvolvimento local. Você poderá então acessar a aplicação de quiz em seu navegador, geralmente em `http://localhost:4200/`.

-----

## Tecnologias Utilizadas

  * **Angular**: Uma plataforma para construir aplicações web para desktop e mobile.
  * **Node.js**: Ambiente de execução JavaScript.
  * **npm**: Gerenciador de pacotes para JavaScript.
