# 📱 Aplicação Mobile (React Native)

O repositório também contém uma versão mobile da aplicação, desenvolvida em **React Native** com Expo e organizada dentro da pasta `mobile/`.

## ✅ Requisitos Atendidos (Mobile)
- Tela inicial com listagem de posts e busca por palavra-chave.
- Tela de leitura do post com envio de comentários.
- CRUD de postagens (criação, edição, exclusão) para docentes.
- CRUD de docentes (listagem paginada, criação, edição, exclusão).
- CRUD de alunos(as) seguindo o mesmo padrão dos docentes.
- Tela administrativa com listagem de posts e ações de edição/exclusão.
- Autenticação obrigatória para áreas administrativas.
- Validação de perfil (docente pode gerenciar, aluno apenas visualizar).

---

## ▶️ Como Executar o Projeto Mobile

### Pré-requisitos
- **Node.js 18+**
- **Expo CLI** (`npm install -g expo-cli`)

### Passo a passo

1. Acesse a pasta mobile:
```bash
cd mobile
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto:
```bash
npm run start
```

4. Use o aplicativo Expo Go (Android/iOS) para escanear o QR Code exibido no terminal.

---

## 🧱 Arquitetura Mobile

```
mobile/
├── App.tsx                 # Entry point da aplicação
├── app.json                # Configurações Expo
└── src/
    ├── api/                # Cliente HTTP e integração com REST
    ├── components/         # Componentes reutilizáveis
    ├── context/            # Context API (autenticação)
    ├── navigation/         # Stack e Bottom Tabs
    ├── screens/            # Telas funcionais
    ├── types/              # Tipagens globais
    └── utils/              # Constantes e helpers
```

---

## 🔌 Integração com o Back-End

O arquivo `mobile/src/utils/constants.ts` possui a variável `API_BASE_URL` que aponta para o back-end.

Exemplo:
```ts
export const API_BASE_URL = 'http://localhost:3000';
```

### Endpoints Consumidos
- `/auth/login` → autenticação de docentes
- `/posts` → listagem e criação de posts
- `/posts/:id` → leitura, edição e exclusão de posts
- `/posts/:id/comments` → comentários
- `/teachers` → CRUD docentes
- `/students` → CRUD alunos

---

## 👩‍🏫 Guia de Uso (Mobile)

1. **Login** com usuário docente.
2. **Posts**: visualizar, buscar e ler conteúdo completo.
3. **Docentes / Alunos**: criação, edição, exclusão e paginação.
4. **Admin**: gerenciamento completo dos posts.

