/**
 * Utilitários de Acessibilidade (A11y)
 * Helpers para melhorar acessibilidade da aplicação
 */

/**
 * Gera um ID único para elementos acessíveis
 */
let idCounter = 0;
export const generateA11yId = (prefix: string = 'a11y'): string => {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
};

/**
 * Props ARIA para elementos interativos
 */
export const getInteractiveProps = (
  label: string,
  options?: {
    disabled?: boolean;
    expanded?: boolean;
    pressed?: boolean;
    selected?: boolean;
  }
) => ({
  'aria-label': label,
  ...(options?.disabled !== undefined && { 'aria-disabled': options.disabled }),
  ...(options?.expanded !== undefined && { 'aria-expanded': options.expanded }),
  ...(options?.pressed !== undefined && { 'aria-pressed': options.pressed }),
  ...(options?.selected !== undefined && { 'aria-selected': options.selected }),
  role: 'button',
  tabIndex: options?.disabled ? -1 : 0,
});

/**
 * Props ARIA para regiões da página
 */
export const getRegionProps = (
  label: string,
  role: 'navigation' | 'main' | 'complementary' | 'banner' | 'contentinfo' = 'region'
) => ({
  role,
  'aria-label': label,
});

/**
 * Props ARIA para status e alertas
 */
export const getLiveRegionProps = (
  role: 'status' | 'alert' = 'status',
  politeness: 'polite' | 'assertive' = 'polite'
) => ({
  role,
  'aria-live': politeness,
  'aria-atomic': 'true',
});

/**
 * Verifica se elemento tem contraste adequado
 * (Implementação simplificada - usar ferramenta real em produção)
 */
export const hasGoodContrast = (
  foreground: string,
  background: string,
  fontSize: number = 16
): boolean => {
  // WCAG AA requer:
  // - 4.5:1 para texto normal (< 18px)
  // - 3:1 para texto grande (>= 18px ou bold >= 14px)
  const requiredRatio = fontSize >= 18 ? 3 : 4.5;

  // Nota: Implementação real deveria calcular o contraste real
  // Esta é apenas uma versão simplificada
  return true; // Placeholder
};

/**
 * Captura foco em elemento
 */
export const focusElement = (
  elementId: string,
  options?: FocusOptions
): void => {
  const element = document.getElementById(elementId);
  if (element) {
    element.focus(options);
  }
};

/**
 * Trap de foco para modais
 */
export const createFocusTrap = (containerElement: HTMLElement) => {
  const focusableElements = containerElement.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleTab = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement?.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement?.focus();
        e.preventDefault();
      }
    }
  };

  containerElement.addEventListener('keydown', handleTab);

  return () => {
    containerElement.removeEventListener('keydown', handleTab);
  };
};

/**
 * Anuncia mensagem para screen readers
 */
export const announceToScreenReader = (
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', priority === 'assertive' ? 'alert' : 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Verifica se navegação é por teclado
 */
export const isKeyboardNavigation = (): boolean => {
  return (
    document.activeElement !== document.body &&
    document.activeElement !== null
  );
};

/**
 * Skip link para conteúdo principal
 */
export const skipToContent = (contentId: string = 'main-content'): void => {
  const content = document.getElementById(contentId);
  if (content) {
    content.setAttribute('tabindex', '-1');
    content.focus();
    content.scrollIntoView({ behavior: 'smooth' });
  }
};

/**
 * Validação de formulário acessível
 */
export const getFormFieldProps = (
  fieldId: string,
  label: string,
  options?: {
    required?: boolean;
    invalid?: boolean;
    describedBy?: string;
    errorId?: string;
  }
) => {
  const props: Record<string, any> = {
    id: fieldId,
    'aria-label': label,
  };

  if (options?.required) {
    props['aria-required'] = 'true';
  }

  if (options?.invalid) {
    props['aria-invalid'] = 'true';
  }

  const describedBy = [];
  if (options?.describedBy) {
    describedBy.push(options.describedBy);
  }
  if (options?.errorId && options?.invalid) {
    describedBy.push(options.errorId);
  }

  if (describedBy.length > 0) {
    props['aria-describedby'] = describedBy.join(' ');
  }

  return props;
};

/**
 * Keyboard shortcuts helper
 */
export const handleKeyboardShortcut = (
  e: KeyboardEvent,
  shortcuts: Record<string, () => void>
): void => {
  const key = e.key.toLowerCase();
  const ctrl = e.ctrlKey || e.metaKey;
  const shift = e.shiftKey;
  const alt = e.altKey;

  let shortcutKey = '';
  if (ctrl) shortcutKey += 'ctrl+';
  if (shift) shortcutKey += 'shift+';
  if (alt) shortcutKey += 'alt+';
  shortcutKey += key;

  if (shortcuts[shortcutKey]) {
    e.preventDefault();
    shortcuts[shortcutKey]();
  }
};

export default {
  generateA11yId,
  getInteractiveProps,
  getRegionProps,
  getLiveRegionProps,
  hasGoodContrast,
  focusElement,
  createFocusTrap,
  announceToScreenReader,
  isKeyboardNavigation,
  skipToContent,
  getFormFieldProps,
  handleKeyboardShortcut,
};
