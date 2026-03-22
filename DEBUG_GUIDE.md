# Guia de Debug - Perfil de Usuário

## ❗ SE NÃO ESTÁ FUNCIONANDO

Siga este guia passo a passo e me informe EXATAMENTE o que você vê em cada etapa.

---

## 📋 PASSO 1: Verificar Console do Navegador

1. **Abra o DevTools:** Pressione `F12`
2. **Vá para a aba Console**
3. **Limpe o console:** Clique no ícone 🚫 (Clear console)

### O que procurar:

**Erros Vermelhos?**
```
❌ Se houver erros em VERMELHO, copie e me envie TUDO
```

**Warnings Amarelos?**
```
⚠️ Warnings sobre Grid? → Já corrigimos (pode ignorar se aparecer)
⚠️ Outros warnings? → Me envie
```

**Nenhuma mensagem?**
```
❓ Se não aparece NADA, nem erros nem logs → Me avise
```

---

## 📋 PASSO 2: Verificar Aba Network

1. **No DevTools, clique na aba "Network"** (Rede)
2. **Recarregue a página:** `Ctrl+R` ou `F5`
3. **Acesse "Meu Perfil"**

### O que procurar:

**Requisição GET /api/usuarios/perfil**
```
✅ Status 200 = OK (funcionando)
❌ Status 401 = Não autenticado
❌ Status 404 = Endpoint não encontrado
❌ Status 500 = Erro no servidor
🔴 Vermelho/Failed = Backend não está acessível
```

**Me diga:**
- ✅ Aparece a requisição?
- ✅ Qual é o Status Code?
- ✅ Tem Response? (clique na requisição → Response tab)

---

## 📋 PASSO 3: Testar Alteração de Senha

1. **Clique em "Alterar Senha"**
2. **Preencha:**
   - Senha Atual: `qualquercoisa`
   - Nova Senha: `senhateste123`
   - Confirmar: `senhateste123`
3. **Clique em "Salvar"**

### O que procurar no Network:

**Requisição PUT /api/usuarios/perfil/senha**

**Status 401 Unauthorized:**
```json
Response: {
  "message": "Senha atual incorreta"
}
```
✅ **ISSO É ESPERADO!** Significa que está funcionando!
❌ Se não aparecer a notificação de erro, há problema no frontend

**Status 204 No Content:**
```
✅ Senha foi alterada com sucesso
✅ Deve aparecer notificação verde
```

**Status 500:**
```
❌ Erro no backend
→ Copie a resposta e me envie
```

**Não aparece requisição:**
```
❌ Frontend não está enviando
→ Verifique console por erros JavaScript
```

---

## 📋 PASSO 4: Verificar Frontend Dev Server

No terminal onde rodou `npm run dev`:

```
✅ Deve mostrar: "Local: http://localhost:5173"
❌ Se não estiver rodando: execute npm run dev
```

---

## 📋 PASSO 5: Verificar Backend

Abra terminal e execute:

```bash
netstat -ano | findstr ":8080"
```

**Resultado esperado:**
```
TCP    0.0.0.0:8080    0.0.0.0:0    LISTENING    [algum número]
```

**Se NÃO aparecer nada:**
```bash
cd C:/projetos/oficina-saas
./mvnw spring-boot:run
```

Aguarde aparecer: `Started OficinaApplication`

---

## 📋 PASSO 6: Testar Backend Diretamente

Execute no PowerShell:

```powershell
Invoke-WebRequest -Uri "http://localhost:8080/api/login" -Method POST -ContentType "application/json" -Body '{"email":"usuario@oficina.com","senha":"senha123"}'
```

**Resultado esperado:**
- ✅ Retorna token JWT
- ❌ Erro 401 = Credenciais incorretas (mas backend está rodando)
- ❌ Erro de conexão = Backend não está rodando

---

## 📋 CHECKLIST COMPLETO

Marque o que você verificou:

- [ ] **Console:** Verifiquei e vi [descreva o que viu]
- [ ] **Network:** Requisição GET perfil aparece? Status: ___
- [ ] **Network:** Requisição PUT senha aparece? Status: ___
- [ ] **Frontend:** `npm run dev` está rodando
- [ ] **Backend:** Porta 8080 está escutando (netstat)
- [ ] **Backend:** Log mostra "Started OficinaApplication"

---

## 🚨 INFORMAÇÕES QUE PRECISO

**Me envie EXATAMENTE estas informações:**

1. **O que você vê na TELA?**
   - [ ] Página em branco?
   - [ ] Página carrega mas campos vazios?
   - [ ] Página carrega com dados?
   - [ ] Botão "Alterar Senha" aparece?
   - [ ] Consegue clicar no botão?

2. **Console (F12 → Console):**
   ```
   [Cole aqui TUDO que aparece no console]
   ```

3. **Network (F12 → Network):**
   ```
   GET /api/usuarios/perfil → Status: ___
   PUT /api/usuarios/perfil/senha → Status: ___
   ```

4. **Notificações:**
   - [ ] Aparece notificação (verde ou vermelha)?
   - [ ] Qual é a mensagem?

5. **Backend Terminal:**
   ```
   [Cole últimas 10 linhas do terminal do backend]
   ```

---

## 💡 TESTES RÁPIDOS

### Teste 1: Página Carrega?
```
URL: http://localhost:5173/perfil
Resultado: [descreva o que vê]
```

### Teste 2: Console Limpo?
```
F12 → Console → [tem erros vermelhos?]
```

### Teste 3: Backend Responde?
```
PowerShell:
curl http://localhost:8080/api/login
Resultado: [erro de conexão OU resposta do servidor]
```

---

## 📸 CAPTURAS DE TELA

Se possível, tire prints de:
1. Tela completa da página de perfil
2. Console (F12 → Console)
3. Network (F12 → Network) mostrando as requisições

---

**AGORA SIGA O GUIA E ME ENVIE AS INFORMAÇÕES ACIMA!** 🔍
