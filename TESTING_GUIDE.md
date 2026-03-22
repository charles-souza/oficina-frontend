# Guia de Testes - Perfil e Usuários

## Pré-requisitos

1. Backend rodando em `http://localhost:8080`
2. Frontend rodando em `http://localhost:5173`
3. Usuário logado no sistema

## Teste 1: Visualizar Perfil

### Passos
1. Fazer login no sistema
2. Clicar no avatar/nome no menu lateral
3. Selecionar "Meu Perfil"

### Resultado Esperado
- ✅ Avatar com iniciais aparece
- ✅ Nome do usuário exibido
- ✅ Email exibido (read-only)
- ✅ Perfil de acesso exibido (read-only)
- ✅ ID da oficina exibido
- ✅ Sem warnings no console do Grid

## Teste 2: Editar Nome

### Passos
1. Na página de perfil, clicar em "Editar"
2. Alterar o nome
3. Clicar em "Salvar"

### Resultado Esperado
- ✅ Botão "Salvar" fica desabilitado durante salvamento
- ✅ Loading indicator aparece
- ✅ Notificação de sucesso exibida
- ✅ Dados atualizados na interface
- ✅ Avatar atualiza com novas iniciais

### Teste de Validação
- ❌ Nome vazio → erro "Nome é obrigatório"
- ❌ Nome com menos de 3 caracteres → erro "Nome deve ter no mínimo 3 caracteres"

## Teste 3: Alterar Senha (Senha Correta)

### Passos
1. Na página de perfil, clicar em "Alterar Senha"
2. Preencher:
   - Senha Atual: sua senha real
   - Nova Senha: min 6 caracteres
   - Confirmar Nova Senha: mesma senha
3. Clicar em "Salvar"

### Resultado Esperado
- ✅ Senha alterada com sucesso
- ✅ Notificação de sucesso
- ✅ Campos limpos após salvamento
- ✅ Modo de edição de senha desativado
- ✅ Status 204 No Content na resposta

## Teste 4: Alterar Senha (Senha Incorreta)

### Passos
1. Na página de perfil, clicar em "Alterar Senha"
2. Preencher senha atual incorreta
3. Clicar em "Salvar"

### Resultado Esperado
- ❌ Erro exibido: "Senha atual incorreta"
- ❌ Status 401 Unauthorized (não 500)
- ✅ Campos permanecem preenchidos
- ✅ Modo de edição permanece ativo

### Teste de Validação
- ❌ Senha atual vazia → "Senha atual é obrigatória"
- ❌ Nova senha vazia → "Nova senha é obrigatória"
- ❌ Nova senha < 6 caracteres → "Senha deve ter no mínimo 6 caracteres"
- ❌ Senhas não coincidem → "As senhas não coincidem"

## Teste 5: Gerenciar Usuários (Admin)

### Pré-requisito
Usuário com perfil ROLE_ADMIN

### Passos
1. Acessar menu "Usuários"
2. Clicar em "Novo Usuário"
3. Preencher:
   - Email: email válido
   - Nome: mínimo 3 caracteres
   - Senha: mínimo 6 caracteres
   - Perfil: Administrador/Mecânico/Usuário
4. Salvar

### Resultado Esperado
- ✅ Usuário criado com sucesso
- ✅ Redirecionado para lista de usuários
- ✅ Novo usuário aparece na lista com avatar
- ✅ Notificação de sucesso

## Teste 6: Editar Usuário (Admin)

### Passos
1. Na lista de usuários, clicar no ícone de editar
2. Alterar nome ou perfil
3. Salvar

### Resultado Esperado
- ✅ Usuário atualizado
- ✅ Email permanece read-only
- ✅ Alerta informando que email não pode ser alterado
- ✅ Notificação de sucesso

## Teste 7: Excluir Usuário (Admin)

### Passos
1. Clicar no ícone de excluir
2. Confirmar exclusão no dialog

### Resultado Esperado
- ✅ Dialog de confirmação aparece
- ✅ Nome e email do usuário exibidos no dialog
- ✅ Usuário removido da lista
- ✅ Notificação de sucesso

## Teste 8: Responsividade

### Mobile (< 768px)
1. Redimensionar navegador para largura mobile
2. Acessar página de perfil

### Resultado Esperado
- ✅ Layout em coluna única
- ✅ Avatar centralizado
- ✅ Campos ocupam largura total
- ✅ Botões empilhados verticalmente

### Desktop (> 768px)
- ✅ Layout em 2 colunas (4/8)
- ✅ Avatar à esquerda
- ✅ Formulários à direita
- ✅ Espaçamento adequado

## Teste 9: Permissões

### Como ROLE_MECANICO
- ✅ Pode acessar "Meu Perfil"
- ✅ Pode editar próprio perfil
- ❌ Não vê menu "Usuários"

### Como ROLE_USER
- ✅ Pode acessar "Meu Perfil"
- ✅ Pode editar próprio perfil
- ❌ Não vê menu "Usuários"

### Como ROLE_ADMIN
- ✅ Acesso total a todos os recursos

## Checklist de Console (Dev Tools)

Verificar que não há:
- ❌ Warnings do MUI Grid
- ❌ Erros 500 nos endpoints
- ❌ Erros de CORS
- ❌ Memory leaks
- ❌ Avisos de deprecated APIs

## Cenários de Erro

### Backend Offline
- ✅ Erro de conexão exibido
- ✅ Loading indicator aparece e desaparece
- ✅ Notificação de erro clara

### Token Expirado
- ✅ Redirecionado para login
- ✅ Mensagem de sessão expirada

### Permissão Negada
- ✅ Erro 403 tratado
- ✅ Mensagem amigável exibida

## Métricas de Performance

- Tempo de carregamento da página: < 1s
- Tempo de resposta de API: < 500ms
- Tamanho do bundle: Otimizado com lazy loading

## Acessibilidade

- ✅ Navegação por teclado funciona
- ✅ Screen readers conseguem ler conteúdo
- ✅ Contraste de cores adequado
- ✅ Labels associados aos inputs
- ✅ Mensagens de erro descritivas

## Relatório de Bugs

Se encontrar problemas, documente:
1. Passos para reproduzir
2. Resultado esperado vs obtido
3. Screenshots/logs do console
4. Ambiente (browser, OS, versão)
