# 📱 Aplicação Mobile de Blogging (React Native)

Este repositório contém a aplicação mobile da plataforma de blogging, desenvolvida com **React Native + Expo** na pasta `mobile/`.

A aplicação implementa autenticação, autorização por perfil (`teacher`/`student`), leitura e busca de posts, criação/edição de conteúdo para docentes e CRUD administrativo de docentes e estudantes.

---

## ✅ Requisitos funcionais atendidos

1. **Página principal (lista de posts)**
   - Listagem de posts com título, autor e descrição.
   - Campo de busca por palavras-chave.
2. **Página de leitura de post**
   - Exibição completa do conteúdo.
   - Envio de comentários (opcional) no endpoint de comentários.
3. **Página de criação de postagens (docentes)**
   - Formulário com título, conteúdo e autor.
4. **Página de edição de postagens (docentes)**
   - Carregamento do post por ID e atualização.
5. **Criação de professores**
   - Formulário administrativo para cadastro.
6. **Edição de professores**
   - Reaproveita o mesmo formulário em modo de edição.
7. **Listagem paginada de professores**
   - Ações de editar e excluir por item.
8. **Requisitos 5, 6 e 7 para estudantes**
   - CRUD e listagem paginada seguindo o padrão de docentes.
9. **Página administrativa de posts**
   - Listagem geral com ações de editar e excluir.
10. **Autenticação e autorização**
   - Login via endpoint de autenticação.
   - Apenas usuários autenticados acessam o app.
   - Recursos administrativos protegidos para perfil docente.

---

## 🧱 Stack técnica

- **React Native** com **Expo**
- **TypeScript**
- **React Navigation** (Stack + Bottom Tabs)
- **Context API** para estado global de autenticação
- **AsyncStorage** para persistência de sessão
- Cliente HTTP com `fetch` centralizado (`apiRequest`)
- **Hooks + componentes funcionais** em toda a camada de interface (estado local, ciclo de vida e contexto com `useState`, `useEffect`, `useMemo`, `useCallback` e hooks customizados).

---

## 🚀 Setup inicial (ambiente de desenvolvimento)

### 1) Pré-requisitos

- **Node.js 18+**
- **npm 9+**
- **Expo CLI** (opcional):

```bash
npm install -g expo-cli
```

> Você também pode usar somente `npx expo` sem instalação global.

### 2) Instalação e execução

```bash
cd mobile
npm install
npm run start
```

Scripts disponíveis em `mobile/package.json`:

- `npm run start` → inicia o Expo Dev Server.
- `npm run android` → abre no emulador Android.
- `npm run ios` → abre no simulador iOS (macOS).
- `npm run web` → executa a versão web (quando disponível).

### 3) Conexão com a API

A URL base está em `mobile/src/utils/constants.ts`:

```ts
export const API_BASE_URL = 'http://localhost:3000';
```

- Em **emulador Android**, `localhost` geralmente funciona com redirecionamento local.
- Em **dispositivo físico**, use o IP da máquina na rede local, por exemplo:

```ts
export const API_BASE_URL = 'http://192.168.0.10:3000';
```

### 4) Validação rápida pós-setup

1. Inicie o back-end da disciplina.
2. Inicie o app com `npm run start`.
3. Faça login com usuário válido.
4. Abra a aba de posts e valide carregamento da lista.

---

## 🗂️ Arquitetura da aplicação

### Visão geral de diretórios

```text
mobile/
├── App.tsx                        # Bootstrap do app
├── src/
│   ├── api/client.ts              # Cliente REST + token bearer
│   ├── components/                # Componentes reutilizáveis (botão, campo, card, gate de perfil)
│   ├── context/AuthContext.tsx    # Sessão, login/logout, carregamento de usuário e role
│   ├── navigation/                # Navegação principal (Stack/Tabs)
│   ├── screens/                   # Telas de negócio (Posts, Admin, Docentes, Alunos)
│   ├── types/                     # Tipos globais da aplicação
│   └── utils/constants.ts         # Constantes de URL/endpoints
├── app.json                       # Configuração Expo
└── package.json                   # Dependências e scripts
```

### Camadas e responsabilidades

- **Presentation (screens/components)**
  - Renderização de UI.
  - Captura de entrada de formulário.
  - Chamada das funções de API para operações CRUD.
- **Navigation (stack + tabs)**
  - Decide fluxo autenticado vs não autenticado.
  - Define rotas administrativas por perfil.
- **State/Auth (`AuthContext`)**
  - Guarda token, usuário e papel.
  - Persiste sessão no `AsyncStorage`.
  - Fornece funções `signIn`/`signOut` para toda a árvore.
- **Data access (`api/client.ts`)**
  - Centraliza requisições HTTP.
  - Injeta headers e token de autenticação.
  - Padroniza tratamento de erro de API.

### Fluxo de autenticação

1. Usuário envia credenciais na tela de login.
2. App chama `POST /auth/login`.
3. Em sucesso, token e dados do usuário são salvos no contexto + `AsyncStorage`.
4. Navegação alterna para rotas autenticadas.
5. Em logout, dados de sessão são limpos e o usuário retorna ao fluxo público.

### Estratégia de autorização

- O papel do usuário (`teacher`/`student`) é validado no client.
- Itens administrativos e ações destrutivas aparecem apenas para `teacher`.
- Componentes de proteção (ex.: `TeacherOnly`) isolam regras de permissão.

---

## 🔌 Integração com back-end

### Endpoints consumidos

- `POST /auth/login`
- `GET /posts`
- `GET /posts/:id`
- `POST /posts`
- `PUT /posts/:id`
- `DELETE /posts/:id`
- `POST /posts/:id/comments`
- `GET /teachers?page=n`
- `GET /teachers/:id`
- `POST /teachers`
- `PUT /teachers/:id`
- `DELETE /teachers/:id`
- `GET /students?page=n`
- `GET /students/:id`
- `POST /students`
- `PUT /students/:id`
- `DELETE /students/:id`

### Convenções de comunicação

- Todas as chamadas usam o cliente central de API (`apiRequest`).
- Rotas protegidas recebem token bearer automaticamente.
- Erros de API são tratados na camada de tela para exibir feedback ao usuário.

---

## 📲 Guia de uso (passo a passo)

### 1) Acesso inicial

1. Abra o app.
2. Faça login com usuário cadastrado no back-end.
3. Após autenticação, o app abre a navegação principal.

### 2) Fluxo comum (todos os perfis)

- Entre em **Posts** para visualizar lista.
- Use a busca para filtrar por palavra-chave.
- Toque em um item para abrir detalhes do post.
- No detalhe, envie comentário quando o endpoint estiver habilitado.

### 3) Fluxo docente (`teacher`)

- Criar postagem em **Nova postagem**.
- Editar/excluir em **Admin**.
- Gerenciar docentes em **Docentes** (listar, criar, editar, excluir).
- Gerenciar estudantes em **Alunos** (listar, criar, editar, excluir).

### 4) Fluxo discente (`student`)

- Acesso às áreas de leitura de conteúdo (Posts e detalhe).
- Sem opções de criação, edição ou exclusão administrativa, que permanecem restritas a docentes.

---

## 🧪 Troubleshooting rápido

- **Erro de rede no celular físico**
  - Verifique se API e celular estão na mesma rede.
  - Troque `localhost` pelo IP da máquina no `API_BASE_URL`.
- **Tela em branco após login**
  - Confira formato do payload retornado por `POST /auth/login`.
  - Verifique se token/role estão sendo persistidos corretamente.
- **Erro 401 em rotas protegidas**
  - Valide expiração do token.
  - Faça logout/login para renovar sessão.

---

## 🎥 Entrega acadêmica sugerida

Para compor a entrega final da disciplina:
1. **Código-fonte** neste repositório.
2. **Vídeo (até 15 min)** demonstrando fluxo, autenticação, permissões e CRUDs.
3. **Documento técnico** com arquitetura, decisões de implementação e desafios encontrados.

## 📘 Documento solicitado (arquitetura, uso e desafios)

O documento completo está em `mobile/DOCUMENTACAO.md`.

---

## 📄 Licença

MIT.
