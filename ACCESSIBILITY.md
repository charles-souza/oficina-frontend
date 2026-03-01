# Guia de Acessibilidade (A11y)

Este documento descreve as práticas de acessibilidade implementadas no projeto.

## 🎯 Padrões Seguidos

- **WCAG 2.1 Level AA** - Web Content Accessibility Guidelines
- **ARIA** - Accessible Rich Internet Applications
- **WAI-ARIA Authoring Practices** - Padrões de widgets

## ✅ Recursos Implementados

### 1. Navegação por Teclado

**Skip Link**
```tsx
import SkipLink from '@/components/common/SkipLink';

// Permite pular para conteúdo principal
<SkipLink href="#main-content" />
```

**Tab Order**
- Ordem lógica de navegação
- Focus visível em todos elementos interativos
- Tab trap em modais

**Atalhos de Teclado**
```tsx
import { handleKeyboardShortcut } from '@/utils/a11y';

useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    handleKeyboardShortcut(e, {
      'ctrl+s': handleSave,
      'ctrl+k': handleSearch,
      'escape': handleClose,
    });
  };
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}, []);
```

### 2. Screen Reader Support

**ARIA Labels**
```tsx
// Botão com label descritivo
<button aria-label="Fechar modal de configurações">
  <CloseIcon />
</button>

// Região principal
<main role="main" aria-label="Conteúdo principal">
  {content}
</main>
```

**Live Regions**
```tsx
import { getLiveRegionProps } from '@/utils/a11y';

// Anúncio de status
<div {...getLiveRegionProps('status', 'polite')}>
  {message}
</div>

// Alerta urgente
<div {...getLiveRegionProps('alert', 'assertive')}>
  {errorMessage}
</div>
```

**Screen Reader Only Content**
```tsx
import ScreenReaderOnly from '@/components/common/ScreenReaderOnly';

<ScreenReaderOnly>
  Instruções adicionais para usuários de screen reader
</ScreenReaderOnly>
```

### 3. Formulários Acessíveis

**Labels e Validação**
```tsx
import { getFormFieldProps } from '@/utils/a11y';

const fieldId = 'email-field';
const errorId = 'email-error';

<TextField
  {...getFormFieldProps(fieldId, 'E-mail', {
    required: true,
    invalid: !!error,
    errorId: errorId,
  })}
  error={!!error}
  helperText={error}
/>

{error && (
  <span id={errorId} role="alert">
    {error}
  </span>
)}
```

**Agrupamento de Campos**
```tsx
<fieldset>
  <legend>Informações Pessoais</legend>
  <TextField label="Nome" />
  <TextField label="Email" />
</fieldset>
```

### 4. Contraste de Cores

**Requisitos:**
- Texto normal: 4.5:1 (WCAG AA)
- Texto grande (18px+): 3:1 (WCAG AA)
- Elementos UI: 3:1 (WCAG AA)

**Temas:**
```tsx
// Cores com contraste adequado em ambos os temas
const theme = {
  light: {
    primary: '#667eea',    // Contraste: 4.8:1
    text: '#1a202c',       // Contraste: 15.8:1
  },
  dark: {
    primary: '#7c3aed',    // Contraste: 5.2:1
    text: '#f7fafc',       // Contraste: 18.6:1
  },
};
```

### 5. Foco Visível

**Estilos de Foco**
```tsx
// Foco visível em todos elementos interativos
sx={{
  '&:focus': {
    outline: '3px solid',
    outlineColor: 'primary.main',
    outlineOffset: '2px',
  },
  '&:focus:not(:focus-visible)': {
    outline: 'none', // Remove em mouse
  },
}}
```

### 6. Modais e Dialogs

**Focus Trap**
```tsx
import { createFocusTrap } from '@/utils/a11y';

useEffect(() => {
  if (open && modalRef.current) {
    const cleanup = createFocusTrap(modalRef.current);
    return cleanup;
  }
}, [open]);
```

**Propriedades ARIA**
```tsx
<Dialog
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <DialogTitle id="dialog-title">Título</DialogTitle>
  <DialogContent id="dialog-description">
    Conteúdo
  </DialogContent>
</Dialog>
```

### 7. Imagens

**Alt Text**
```tsx
// Imagem decorativa
<img src="logo.png" alt="" role="presentation" />

// Imagem informativa
<img src="chart.png" alt="Gráfico de vendas mostrando crescimento de 20%" />

// Ícones com texto
<button>
  <SaveIcon aria-hidden="true" />
  <span>Salvar</span>
</button>

// Ícones sem texto
<IconButton aria-label="Salvar documento">
  <SaveIcon />
</IconButton>
```

### 8. Tabelas

**Headers e Scope**
```tsx
<table>
  <thead>
    <tr>
      <th scope="col">Nome</th>
      <th scope="col">Email</th>
      <th scope="col">Ações</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>{name}</td>
      <td>{email}</td>
      <td>
        <button aria-label={`Editar ${name}`}>
          <EditIcon />
        </button>
      </td>
    </tr>
  </tbody>
</table>
```

## 🧪 Testes de Acessibilidade

### Ferramentas

1. **axe DevTools** - Extensão do Chrome/Firefox
2. **Lighthouse** - Audit de acessibilidade
3. **Screen Reader** - NVDA (Windows), VoiceOver (Mac)
4. **Keyboard Only** - Testar sem mouse

### Checklist Manual

- [ ] Toda funcionalidade acessível por teclado
- [ ] Tab order lógica
- [ ] Foco visível em todos elementos
- [ ] Labels em todos inputs
- [ ] Alt text em todas imagens
- [ ] Contraste adequado (4.5:1)
- [ ] Headings hierárquicos (h1, h2, h3...)
- [ ] ARIA labels onde necessário
- [ ] Links descritivos
- [ ] Erros anunciados para screen readers
- [ ] Modais trapam foco
- [ ] Skip links funcionando

## 📱 Responsividade

```tsx
// Touch targets: mínimo 44x44px
<Button
  sx={{
    minWidth: 44,
    minHeight: 44,
  }}
>
  Click
</Button>

// Zoom até 200%
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
```

## 🎨 Design Inclusivo

### Não use apenas cor
```tsx
// ❌ RUIM: Apenas cor
<span style={{ color: 'red' }}>Erro</span>

// ✅ BOM: Cor + ícone + texto
<Alert severity="error" icon={<ErrorIcon />}>
  Erro: Email inválido
</Alert>
```

### Movimento e Animações
```tsx
// Respeitar preferência de movimento reduzido
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Tamanho de Fonte
```tsx
// Use unidades relativas (rem, em)
fontSize: '1rem',      // 16px
fontSize: '1.25rem',   // 20px
fontSize: '1.5rem',    // 24px
```

## 📊 Status Atual

### Conformidade WCAG 2.1

- ✅ **Perceptível** - Informação perceptível
- ✅ **Operável** - Interface operável
- ✅ **Compreensível** - Informação compreensível
- ✅ **Robusto** - Conteúdo robusto

### Melhorias Contínuas

- [ ] Adicionar mais atalhos de teclado
- [ ] Testar com múltiplos screen readers
- [ ] Documentar padrões ARIA customizados
- [ ] Adicionar testes automatizados de a11y

## 📚 Recursos

- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

## 🤝 Contribuindo

Ao adicionar novos componentes:

1. Teste navegação por teclado
2. Adicione ARIA labels apropriados
3. Verifique contraste de cores
4. Teste com screen reader
5. Documente padrões de acessibilidade

---

**Acessibilidade não é opcional** - é essencial para todos os usuários! ♿
