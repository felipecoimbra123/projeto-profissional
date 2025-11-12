# Desvalorização da Arte Fotográfica no Brasil

# Projeto Profissional - Planejamento

**Aluno:** Felipe Coimbra Rocha dos Santos

**Título do Projeto:** SOCIAL PICTURE: Aplicação para o enfrentamento da desvalorização da arte fotográfica no Brasil

**Repositório:** [https://github.com/felipecoimbra123/projeto-profissional](https://github.com/felipecoimbra123/projeto-profissional)

**Professor Orientador:** André Nata Mello Botton e Iuri Nascimento Santos

**Período:** Maio a Novembro de 2025

# Objetivo da Aplicação
* Incentivar novos artistas, conscientizar e direcionar as pessoas a refletir sobre o quanto a fotografia pode ser importante para os dias de hoje, para eventos históricos e acontecimentos do passado. Além disso, será possível que os artistas publiquem suas próprias fotografias para fazer com que sua foto possa servir de inspiração para outros artistas, além de também ter um espaço onde é possivel escrever os próprios artigos para fornecer conhecimentos, informações e técnicas para outros usuários.

# Tecnologias usadas
* HTML
* CSS
* JavaScript

# 🚀 Configuração e Instalação

Para que a aplicação funcione corretamente, siga os passos abaixo.

### Pré-requisitos
* **Node.js**
* **Servidor MySQL**:

### 1. Clonagem do Repositório

```
git clone https://github.com/seu-usuario/nome-do-repositorio.git 
cd nome-do-repositorio
```

### 2. Instalações das Dependências
```
npm install express mysql2 cors dotenv multer jsonwebtoken swagger-jsdoc swagger-ui-express zod bcrypt
```

### 3. Configuração do Ambiente
Dentro do arquivo db_config.js, na pasta lib, preencha com suas credenciais do banco de dados
```
DB_HOST=localhost
DB_USER=seu_usuario_mysql
DB_PASSWORD=sua_senha_mysql
DB_NAME=fotografia_pp
JWT_SECRET=senha_muito_da_hora
```

### 4. Setup do Banco de Dados

```mysql
create database fotografia_pp;
use fotografia_pp;

create table usuario(
	id int primary key auto_increment,
    nome varchar(255) not null,
    email varchar(255) not null unique,
    senha varchar(255) not null,
    seguidores int,
    imagemPerfil varchar(255),
    criadoEm timestamp default current_timestamp
);

create table seguir(
	seguidor int,
    seguindo int,
    foreign key (seguidor) references usuario(id) ON DELETE CASCADE,
    foreign key (seguindo) references usuario(id) ON DELETE CASCADE
);

create table artigo(
	id int primary key auto_increment,
    titulo varchar(255),
    conteudo varchar(255),
    imagemArtigo varchar(255),
    categoria varchar(255),
    criadoEm timestamp default current_timestamp,
    autor_id int,
    foreign key (autor_id) references usuario(id) ON DELETE CASCADE
);

create table fotografia(
	id int primary key auto_increment,
    titulo varchar(255),
    descricao varchar(255) not null,
    url varchar(255) not null,
    media_avaliacao float,
    curtidas int,
    autor_id int,
    foreign key (autor_id) references usuario(id) ON DELETE CASCADE
);

create table comentario(
	id int primary key auto_increment,
    texto varchar(255) not null,
    fotografia int,
    autor_id int,
    foreign key (fotografia) references fotografia(id) ON DELETE CASCADE,
    foreign key (autor_id) references usuario(id) ON DELETE CASCADE,
    criadoEm timestamp default current_timestamp
);

create table likes(
	id int primary key auto_increment,
    post_id int not null,
    user_id int not null,
    foreign key (post_id) references fotografia(id) ON DELETE CASCADE,
    foreign key (user_id) references usuario(id) ON DELETE CASCADE
);

create table favorites(
	id int primary   key auto_increment,
	post_id int not null,
	user_id int not null,
	foreign key (post_id) references fotografia(id) ON DELETE CASCADE,
	foreign key (user_id) references usuario(id) ON DELETE CASCADE
);

create table feedback(
	id int primary key auto_increment,
    texto varchar(265) not null,
    autor_id int,
    foreign key (autor_id) references usuario(id) ON DELETE SET NULL,
    criadoEm timestamp default current_timestamp
);
```

# Acessibilidade
- [x] Elementos não textuais
    - [x] Todas as imagens têm um texto alternativo (alt). Isso deve ser atendido por conta da aplicação estar cheia de imagens, é algo necessário pensando nas pessoas deficientes visuais. Totalmente relevante, considerando que o público alvo são fotógrafos.
    - [x] Os itens não textuais têm uma versão alternativa em texto. Mesma coisa que acima, os únicos itens não textuais até agora são as imagens.
    - [x] Não são usadas imagens que contêm blocos de texto. Não estão sendo usadas, está sendo usado elementos diretamente para texto.
- [x] Formulários
    - [x] Todos os campos dos formulários têm uma <label> associada. Deve ser atendido por conta de uma melhor experiência para o usuário e maior acessibilidade para deficientes visuais.
    - [x] São usados <fieldset> e <legend> para agrupar os vários campos nos formulários. Relevante para melhorar deficientes visuais a compreenderem melhor as estruturas do formulário. Relevante, ainda por ser totalmente implementado na aplicação.
    - [x] O envio dos formulários é feito via input/button e não através de links e JavaScript. Relevante, se torna acessível para leitores de tela e etc.
    - [x] Os erros nos formulários são indicados em texto e junto do campo que contém o erro. Não são mostrados o campo que contêm o erros, mas em texto sim. Não parece ser relevante para meu público-alvo.
- [x] Uso da cor e elementos que piscam
    - [x] Não é usada apenas a cor para transmitir informação. Relevante para pessoas com Daltonismo e outras deficiência visuais relacionadas.
    - [x] Não há elementos que piscam ou mudam de cores repetidamente. Totalmente relevante, principalmente para garantir que usuários com epilepsia ou outras condições relacionadas possam navegar no site com segurança.
- [x] Navegação
    - [x] São fornecidos atalhos para saltar links repetitivos. Ainda não feito, mas será implementado para melhorar a acessibilidade para usuários de tecnologias assistivas.
    - [x] O <title> das páginas é claro, direto e percetível e está intimamente relacionado com o conteúdo da mesma. Totalmente relevante para pessoas com leitores de telas ou etc entenderem mais facilmente o conteúdo de cada página.
    - [x] O site é navegável usando apenas o teclado. Útil para que usuários com deficiências motoras ou visual consigam utilizar o site da melhor forma.
- [x] Semântica e Legibilidade
    - [x] O conteúdo está estruturado de forma semântica. Relevante para acessibilidade de tecnologias assistivas e boas práticas web.
    - [x] O idioma da página está indicado no HTML. Relevante para informar o idioma que a aplicação utiliza para o navegador, facilitando a troca de idiomas na interface.
    - [x] As tabelas têm headings <th> definidos. Não relevantes para o meu público-alvo e aplicação, pois não estão sendo utilizadas tabelas.
    - [x] O site funciona com as imagens desativadas. Relevante para velocidade de carregamento da interface e para pessoas com deficiências visuais que utilizam leitores de tela.
    - [x] O site é legível e navegável com o CSS desativado. Relevante para garantir que o site seja utilizável sem estilização e também melhorar a usabilidade, pois às vezes alguns navegadores não carregam totalmente o CSS.
    - [x] O site é legível aumentando o texto 2 vezes. Relevante para pessoas com deficiências visuais e para que imagens e outros elementos fiquem mais legíveis.
