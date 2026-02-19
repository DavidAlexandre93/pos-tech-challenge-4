# Teste manual em dispositivo físico com backend real

Este roteiro valida os fluxos reais no app Expo em dispositivo físico, cobrindo login, CRUD e autorização por perfil.

## Pré-requisitos

1. API backend em execução e acessível pela rede local.
2. Ajustar `API_BASE_URL` em `src/utils/constants.ts` para o IP da máquina host.
3. Smartphone com Expo Go instalado.
4. Conta **teacher** e conta **student** válidas no backend.

## Execução

1. Na pasta `mobile/`, execute `npm run start`.
2. Escaneie o QR Code no Expo Go.
3. Faça login com usuário `teacher` e valide os cenários abaixo.
4. Faça logout e repita com usuário `student`.

## Cenários obrigatórios

### 1) Login e sessão
- Login com credenciais válidas deve abrir o app.
- Logout deve retornar para tela de login.

### 2) Fluxo de posts (todos)
- Listagem de posts carrega sem erro.
- Busca por palavra-chave funciona.
- Abertura de detalhe do post funciona.
- Envio de comentário funciona quando endpoint estiver ativo.

### 3) Fluxo administrativo de posts (teacher)
- Aba **Admin** deve aparecer para `teacher`.
- Criar postagem deve persistir e aparecer na lista.
- Editar postagem deve atualizar conteúdo.
- Excluir postagem deve remover da lista.

### 4) Fluxo docentes e alunos (teacher)
- Aba **Docentes** deve permitir criar, editar e excluir docente.
- Aba **Alunos** deve permitir criar, editar e excluir aluno.

### 5) Autorização (student)
- Usuário `student` deve ver apenas aba **Posts**.
- Ações administrativas (criar/editar/excluir) não devem ficar acessíveis.

## Evidências recomendadas

- Prints das telas principais por perfil.
- Registro de payload/response no backend para operações de CRUD.
- Resultado final de cada cenário: **OK** ou **Falhou** com descrição.
