# Desvalorização da Arte Fotográfica no Brasil

# Projeto Profissional - Planejamento

**Aluno:** Felipe Coimbra Rocha dos Santos

**Título do Projeto:** Desvalorização da arte fotográfica no Brasil

**Repositório:** [https://github.com/felipecoimbra123/projeto-profissional](https://github.com/felipecoimbra123/projeto-profissional)

**Professor Orientador:** André Nata Mello Botton

**Período:** Maio a Novembro de 2025

---

## 🗓️ MAIO – Planejamento e Início do Back-end

- [x]  Escolher a stack (front/back/banco)
- [x]  Criar repositório GitHub e organizar README inicial
- [x]  Estruturar diretórios do projeto
- [x]  Criar diagrama ER/MER
- [x]  Criar o banco de dados com tabelas como: usuario, artigo, fotografia, comentario, seguir…
- [ ]  Criar formulários de cadastro/login
- [x]  Criar as entidades e conexão com o banco
- [ ]  Testar endpoints com ThunderClient
- [ ]  Implementar CRUD das páginas de login e cadastro

---

## 🗓️ JUNHO – Desenvolvimento e Deploy do Back-end

- [ ]  Adicionar autenticação e middleware
- [ ]  Adicionar validações nos inputs
- [ ]  Transformar as senhas em criptografadas com bcrypt
- [ ]  Criar outras entidades e relacionamentos, se preciso
- [ ]  Finalizar as rotas da API
- [ ]  Documentar as rotas com Swagger
- [ ]  Fazer deploy da API com Render
- [ ]  Escrever textos sobre a história da fotografia e sobre a primeira pessoa fotografada para a página de artigos

---

## 🗓️ JULHO – Front-end e Integração com API

- [ ]  Iniciar desenvolvimento com base no Figma do projeto
- [ ]  Criar rotas, páginas e componentes principais
- [ ]  Consumir dados da API
- [ ]  Exibir dados dinamicamente (GET)
- [ ]  Aplicar estilos e responsividade

---

## 🗓️ AGOSTO – Testes e Melhorias

- [ ]  Testar todos os fluxos do sistema
- [ ]  Corrigir bugs e falhas visuais
- [ ]  Tratar erros de login, cadastro e formulários
- [ ]  Otimizar interface com base no [Checklist de Acessibilidade - SAPO UX](https://ux.sapo.pt/checklists/acessibilidade/), garantindo usabilidade e acessibilidade
- [ ]  Entregar primeira versão funcional

---

## 🗓️ SETEMBRO – Documentação e Revisão

- [ ]  Atualizar o artigo com prints da aplicação
- [ ]  Criar vídeo ou GIF demonstrativo (opcional)
- [ ]  Escrever documentação técnica do código com MarkDown
- [ ]  Fazer checklist completo do projeto

---

## 🗓️ OUTUBRO – Apresentação Final

- [ ]  Criar roteiro da apresentação (slide ou pitch)
- [ ]  Ensaiar apresentação (tempo estimado: 10 minutos)
- [ ]  Apresentar para pré-banca
- [ ]  Apresentação final

---

## 🗓️ NOVEMBRO – Finalização e Entrega

- [ ]  Revisar e entregar artigo final
- [ ]  Entregar links finais (GitHub + documentação)
- [ ]  Fazer backup da aplicação e banco
- [ ]  Receber avaliação final

---

## 📌 Anotações

- Data do próximo check-in: `26/05/2025`
- Dificuldades enfrentadas:
    - …
- Próximas metas:
    - …

Sobre:
Este cronograma representa um **modelo padrão de desenvolvimento** do Projeto Profissional do curso técnico em Desenvolvimento de Sistemas. Ele está organizado por etapas mensais, indo do planejamento à entrega final, com tarefas genéricas que refletem o ciclo completo de uma aplicação.

Cada aluno deve **personalizar este cronograma**, adaptando as tarefas à **realidade do seu próprio projeto**. Isso inclui:

- Substituir ou detalhar tarefas com base nas **funcionalidades da sua aplicação**;
- Adicionar tarefas específicas como **integração com APIs externas, relatórios, dashboards, gamificação, etc.**;
- Inserir links, anotações ou subtarefas úteis ao seu processo de desenvolvimento;
- Atualizar frequentemente o status de cada tarefa para que o professor possa acompanhar seu progresso.

> Este documento será usado como ferramenta de acompanhamento e orientação ao longo do ano. Mantenha-o atualizado com responsabilidade.
>

# Objetivo
* Incentivar novos artistas, conscientizar e direcionar as pessoas a refletir sobre o quanto a fotografia pode ser importante para os dias de hoje, para eventos históricos e acontecimentos do passado. Além disso, será possível que os artistas publiquem suas próprias fotografias para fazer com que sua foto possa servir de inspiração para outros artistas, além de também ter um espaço onde é possivel escrever os próprios artigos para fornecer conhecimentos, informações e técnicas para outros usuários.

# Tecnologias usadas
* HTML
* CSS
* JavaScript

# Funcionalidades
* Navegação entre páginas
* Formulário de Cadastro
* Formulário de Login

# Acessibilidade
- [x] Elementos não textuais
    - [x] Todas as imagens têm um texto alternativo (alt). Isso deve ser atendido por conta da aplicação estar cheia de imagens, é algo necessário pensando nas pessoas deficientes visuais. Totalmente relevante, considerando que o público alvo são fotógrafos.
    - [x] Os itens não textuais têm uma versão alternativa em texto. Mesma coisa que acima, os únicos itens não textuais até agora são as imagens.
    - [x] Não são usadas imagens que contêm blocos de texto. Não estão sendo usadas, está sendo usado elementos diretamente para texto.
- [x] Formulários
    - [x] Todos os campos dos formulários têm uma <label> associada. Deve ser atendido por conta de uma melhor experiência para o usuário e maior acessibilidade para deficientes visuais.
    - [x] São usados <fieldset> e <legend> para agrupar os vários campos nos formulários. Relevante para melhorar deficientes visuais a compreenderem melhor as estruturas do formulário. Relevante, ainda por ser totalmente implementado na aplicação.
    - [x] O envio dos formulários é feito via input/button e não através de links e JavaScript. Relevante, se torna acessível para leitores de tela e etc.
    - [ ] Os erros nos formulários são indicados em texto e junto do campo que contém o erro. Não são mostrados o campo que contêm o erros, mas em texto sim. Não parece ser relevante para meu público-alvo.
- [x] Uso da cor e elementos que piscam
    - [x] Não é usada apenas a cor para transmitir informação. Relevante para pessoas com Daltonismo e outras deficiência visuais relacionadas.
    - [x] Não há elementos que piscam ou mudam de cores repetidamente. Totalmente relevante, principalmente para garantir que usuários com epilepsia ou outras condições relacionadas possam navegar no site com segurança.
- [x] Navegação
    - [ ] São fornecidos atalhos para saltar links repetitivos. Ainda não feito, mas será implementado para melhorar a acessibilidade para usuários de tecnologias assistivas.
    - [x] O <title> das páginas é claro, direto e percetível e está intimamente relacionado com o conteúdo da mesma. Totalmente relevante para pessoas com leitores de telas ou etc entenderem mais facilmente o conteúdo de cada página.
    - [x] O site é navegável usando apenas o teclado. Útil para que usuários com deficiências motoras ou visual consigam utilizar o site da melhor forma.
- [x] Semântica e Legibilidade
    - [x] O conteúdo está estruturado de forma semântica. Relevante para acessibilidade de tecnologias assistivas e boas práticas web.
    - [x] O idioma da página está indicado no HTML. Relevante para informar o idioma que a aplicação utiliza para o navegador, facilitando a troca de idiomas na interface.
    - [x] As tabelas têm headings <th> definidos. Não relevantes para o meu público-alvo e aplicação, pois não estão sendo utilizadas tabelas.
    - [x] O site funciona com as imagens desativadas. Relevante para velocidade de carregamento da interface e para pessoas com deficiências visuais que utilizam leitores de tela.
    - [x] O site é legível e navegável com o CSS desativado. Relevante para garantir que o site seja utilizável sem estilização e também melhorar a usabilidade, pois às vezes alguns navegadores não carregam totalmente o CSS.
    - [x] O site é legível aumentando o texto 2 vezes. Relevante para pessoas com deficiências visuais e para que imagens e outros elementos fiquem mais legíveis.
