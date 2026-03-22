# Melhorias de Perfil e Gerenciamento de Usuários

## Resumo das Alterações

### Frontend

#### 1. Página de Perfil (PerfilPage.tsx)
- **Antes**: Dados mockados, sem integração com API
- **Depois**:
  - Integração completa com API
  - Busca dados reais do usuário logado
  - Permite edição de nome
  - Permite alteração de senha com validação
  - Campos read-only: email, perfil de acesso, ID da oficina
  - Design responsivo com Grid
  - Feedback visual para ações (loading, erros)
  - Validações de formulário

#### 2. Página de Usuários (UsuariosPage.tsx)
- **Melhorias**:
  - Header visual com gradiente
  - Avatar com iniciais para cada usuário
  - Melhor UX para estado vazio
  - Mensagens de confirmação mais claras
  - Design mais consistente com o resto da aplicação

#### 3. Formulário de Usuário (UsuarioForm.tsx)
- **Melhorias**:
  - Header visual com gradiente
  - Descrições mais claras dos perfis de acesso
  - Tooltips e helperTexts informativos
  - Alertas contextuais para modo edição
  - Melhor feedback de validação
  - Layout mais espaçado e legível

#### 4. Rotas (routes.tsx)
- **Alteração**: Perfil agora acessível por todos os usuários autenticados (ADMIN, MECANICO, USER)

### Backend

#### 1. Novos DTOs Criados
- **PerfilUpdateRequest.java**: Para atualização de dados do perfil
- **SenhaUpdateRequest.java**: Para alteração de senha

#### 2. Novo Controller
- **PerfilController.java**:
  - `GET /api/usuarios/perfil` - Buscar dados do perfil do usuário logado
  - `PUT /api/usuarios/perfil` - Atualizar nome do perfil
  - `PUT /api/usuarios/perfil/senha` - Alterar senha

#### 3. Novo Service
- **PerfilService.java**:
  - Busca perfil pelo email do usuário autenticado
  - Atualiza dados do perfil
  - Valida senha atual antes de permitir alteração
  - Criptografa nova senha com BCrypt

## Endpoints da API

### Perfil (Todos os usuários autenticados)
```
GET    /api/usuarios/perfil          - Buscar dados do perfil
PUT    /api/usuarios/perfil          - Atualizar nome
PUT    /api/usuarios/perfil/senha    - Alterar senha
```

### Usuários (Apenas ADMIN)
```
GET    /api/usuarios                 - Listar todos os usuários
GET    /api/usuarios/{id}            - Buscar usuário por ID
POST   /api/usuarios                 - Criar novo usuário
PUT    /api/usuarios/{id}            - Atualizar usuário
DELETE /api/usuarios/{id}            - Excluir usuário
```

## Fluxo de Usuário

### 1. Edição de Perfil (Qualquer usuário)
1. Usuário acessa "Meu Perfil" no menu superior
2. Visualiza suas informações pessoais
3. Pode editar apenas o nome
4. Pode alterar a senha informando a senha atual
5. Email e perfil de acesso não podem ser alterados

### 2. Gerenciamento de Usuários (Apenas Admin)
1. Admin acessa "Usuários" no menu lateral
2. Visualiza lista de todos os usuários
3. Pode criar novo usuário (email, nome, senha, perfil)
4. Pode editar usuário existente (nome e perfil)
5. Pode excluir usuários
6. Email não pode ser alterado após criação
7. Senha deve ser alterada pelo próprio usuário

## Validações

### Perfil
- **Nome**: Mínimo 3 caracteres
- **Senha Atual**: Obrigatória e deve estar correta
- **Nova Senha**: Mínimo 6 caracteres
- **Confirmação de Senha**: Deve coincidir com nova senha

### Usuário (Admin)
- **Email**: Formato válido, único no sistema
- **Nome**: Mínimo 3 caracteres, máximo 100
- **Senha**: Mínimo 6 caracteres (apenas na criação)
- **Perfil**: Um dos valores: ADMIN, MECANICO, USER

## Permissões

### Perfis de Acesso
- **ROLE_ADMIN**: Acesso completo ao sistema
- **ROLE_MECANICO**: Acesso a ordens de serviço e orçamentos
- **ROLE_USER**: Acesso básico

### Recursos por Perfil
- **Todos**: Visualizar e editar próprio perfil
- **ADMIN**: Gerenciar todos os usuários, acessar todas as funcionalidades
- **MECANICO**: Acessar orçamentos e ordens de serviço
- **USER**: Acesso limitado conforme configuração

## Segurança

1. **Autenticação**: JWT Token obrigatório
2. **Autorização**: Endpoints de perfil verificam usuário autenticado
3. **Senha**: Criptografada com BCrypt
4. **Validação**: Senha atual obrigatória para alteração
5. **Isolamento**: Usuário só pode editar próprio perfil

## Melhorias de UX

1. ✅ Design consistente com gradientes e cores do tema
2. ✅ Feedback visual imediato (loading, sucesso, erro)
3. ✅ Avatares com iniciais para identificação visual
4. ✅ Tooltips e textos de ajuda contextuais
5. ✅ Validação em tempo real dos formulários
6. ✅ Mensagens de confirmação para ações destrutivas
7. ✅ Layout responsivo para mobile e desktop
8. ✅ Estado vazio com CTA claro
9. ✅ Campos read-only claramente identificados
10. ✅ Separação clara entre informações e ações de segurança

## Como Testar

### 1. Testar Perfil
```bash
# Como qualquer usuário
1. Fazer login
2. Clicar no avatar no menu superior
3. Clicar em "Meu Perfil"
4. Editar nome e salvar
5. Clicar em "Alterar Senha"
6. Preencher senha atual e nova senha
7. Salvar
```

### 2. Testar Gerenciamento de Usuários
```bash
# Como ADMIN
1. Acessar menu "Usuários"
2. Clicar em "Novo Usuário"
3. Preencher formulário e salvar
4. Clicar em editar (ícone de lápis)
5. Alterar nome ou perfil
6. Salvar
7. Clicar em excluir (ícone de lixeira)
8. Confirmar exclusão
```

## Próximos Passos Sugeridos

1. ⬜ Upload de foto de perfil
2. ⬜ Recuperação de senha por email
3. ⬜ Histórico de login
4. ⬜ Autenticação de dois fatores
5. ⬜ Campos personalizados para usuário (telefone, departamento, etc)
6. ⬜ Notificações de alteração de senha
7. ⬜ Logs de auditoria de alterações
