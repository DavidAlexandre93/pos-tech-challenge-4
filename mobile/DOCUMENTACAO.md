# Documentação Técnica e Relato de Desenvolvimento

## 1. Visão geral

A aplicação mobile foi desenvolvida em **React Native com Expo** para consumir a API da plataforma de blogging e disponibilizar, em dispositivos móveis, os fluxos de autenticação, leitura de posts e operações administrativas conforme o perfil do usuário.

O foco principal do projeto foi garantir:
- experiência simples para consumo de conteúdo (lista, busca e leitura de posts);
- controle de acesso por perfil (**student** e **teacher**);
- operações de CRUD para entidades administrativas (posts, docentes e alunos);
- estrutura de código legível e fácil de manter em contexto acadêmico.

---

## 2. Arquitetura do sistema

A arquitetura segue um modelo em camadas simples, separando responsabilidades de navegação, estado global de autenticação, comunicação HTTP e telas de negócio.

### 2.1 Organização de pastas

```text
mobile/
├── App.tsx
├── src/
│   ├── api/                 # Cliente HTTP e integração com backend
│   ├── components/          # Componentes reutilizáveis de interface
│   ├── context/             # Estado global de autenticação/sessão
│   ├── navigation/          # Fluxos de navegação (Stack + Tabs)
│   ├── screens/             # Telas e regras de apresentação
│   ├── types/               # Tipagens TypeScript
│   └── utils/               # Constantes (rotas, URL base da API)
└── DOCUMENTACAO.md
```

### 2.2 Camadas e responsabilidades

- **Camada de apresentação (screens/components)**
  - Renderiza listas, formulários e detalhes.
  - Aciona chamadas da API e exibe feedback ao usuário.

- **Camada de navegação (navigation)**
  - `AppNavigator`: decide entre fluxo de login ou app autenticado.
  - `AppTabs`: organiza áreas funcionais e restringe seções administrativas por papel.

- **Camada de estado global (context/AuthContext)**
  - Realiza login/logout.
  - Persiste sessão com AsyncStorage.
  - Disponibiliza método de autorização (`hasRole`).

- **Camada de integração (api/client)**
  - Centraliza chamadas HTTP.
  - Injeta token Bearer automaticamente.
  - Trata respostas de erro de maneira padronizada.

### 2.3 Fluxo de autenticação e autorização

1. Usuário informa e-mail e senha na tela de login.
2. App consome `POST /auth/login`.
3. Token e dados do usuário são persistidos no AsyncStorage.
4. Em reabertura, sessão é restaurada automaticamente.
5. O papel do usuário controla o que pode ser acessado:
   - **student**: navegação de leitura de conteúdo;
   - **teacher**: acesso adicional a CRUDs administrativos.

### 2.4 Integração com backend

A aplicação depende de API REST externa, configurada por `API_BASE_URL`.
Os principais recursos consumidos são:
- autenticação;
- posts (listagem, detalhe, criação, edição e exclusão);
- docentes (CRUD e paginação);
- alunos (CRUD e paginação).

---

## 3. Uso da aplicação

### 3.1 Execução local

```bash
cd mobile
npm install
npm run start
```

Depois, executar no Expo Go (dispositivo físico) ou emulador.

### 3.2 Passo a passo de uso

1. **Login** com credenciais válidas da API.
2. **Posts**:
   - visualizar feed;
   - buscar por termo;
   - abrir leitura detalhada.
3. **Recursos de docente** (quando perfil `teacher`):
   - criar e editar postagens;
   - administrar posts existentes;
   - cadastrar, editar, listar e excluir docentes;
   - cadastrar, editar, listar e excluir alunos.

### 3.3 Regras principais de negócio

- Usuário não autenticado não acessa as telas internas.
- Ações administrativas são restritas ao papel de docente.
- Token é enviado automaticamente nas requisições protegidas.

---

## 4. Relato de experiências e desafios da equipe

Durante o desenvolvimento, a equipe registrou os principais pontos de aprendizado e dificuldades:

### 4.1 Principais desafios enfrentados

1. **Gerenciar múltiplos fluxos de navegação**
   - Separar pilhas e tabs por domínio funcional exigiu organização para evitar rotas duplicadas e inconsistências.

2. **Controle de permissões por perfil**
   - Garantir que telas e ações administrativas apareçam apenas para docentes demandou validações em vários pontos da navegação e UI.

3. **Persistência de sessão**
   - Tratar restauração de token e usuário no carregamento inicial foi essencial para não degradar a experiência de uso.

4. **Padronização de chamadas HTTP**
   - Centralizar headers, tratamento de erro e envio de token evitou repetição e reduziu bugs.

5. **Sincronização com backend em evolução**
   - Ajustes de payload, mensagens de erro e contratos de endpoint foram frequentes, exigindo comunicação contínua entre frente mobile e API.

### 4.2 Aprendizados obtidos

- Definir uma estrutura de pastas desde o início acelera manutenção.
- Tipagem com TypeScript ajuda a prevenir erros de integração.
- Componentização de UI reduz duplicação e facilita ajustes visuais.
- Planejar autorização como requisito central evita retrabalho.
- Documentar decisões de arquitetura melhora onboarding da equipe.

### 4.3 Melhorias futuras sugeridas

- Inclusão de testes automatizados (unitários e de integração).
- Estados de carregamento/erro mais detalhados por tela.
- Paginação e filtros mais avançados na listagem de posts.
- Observabilidade (logs estruturados e monitoramento de falhas).
- Pipeline CI para lint, type-check e build.

---

## 5. Conclusão

O projeto mobile atende os requisitos funcionais propostos para o contexto acadêmico e estabelece uma base sólida para evolução. A combinação de navegação modular, contexto de autenticação, cliente HTTP centralizado e separação por camadas permitiu entregar um aplicativo consistente e com regras de acesso bem definidas.
