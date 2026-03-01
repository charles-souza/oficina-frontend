# Guia de Performance e Otimização

## 📊 Estratégias Implementadas

### 1. Code Splitting e Lazy Loading
- ✅ Todas as rotas com `React.lazy()`
- ✅ Componentes carregados sob demanda
- ✅ Suspense boundaries configurados
- ✅ Loading fallbacks otimizados

### 2. Bundle Optimization
- ✅ Chunking manual de vendors (React, MUI, etc)
- ✅ Separação de ícones MUI em chunk próprio
- ✅ Charts (recharts) em chunk separado
- ✅ CSS code splitting habilitado
- ✅ Tree shaking automático

### 3. Build Configuration
- ✅ Terser minification
- ✅ Console.logs removidos em produção
- ✅ Debuggers removidos
- ✅ Sourcemaps desabilitados em produção
- ✅ Gzip/Brotli compression ready

### 4. Assets Optimization
- ✅ Nomes de arquivos com hash para cache
- ✅ Assets organizados por tipo (js, css, images)
- ✅ Chunk size warnings configurados

## 🚀 Boas Práticas de Performance

### React Component Optimization

```tsx
// ✅ BOM: Memoize componentes pesados
import { memo } from 'react';

const HeavyComponent = memo(({ data }) => {
  return <div>{/* renderização pesada */}</div>;
});

// ✅ BOM: Use useMemo para cálculos caros
const ExpensiveList = ({ items }) => {
  const sortedItems = useMemo(
    () => items.sort((a, b) => a.value - b.value),
    [items]
  );
  return <ul>{/* render sortedItems */}</ul>;
};

// ✅ BOM: Use useCallback para funções em props
const Parent = () => {
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);
  return <Child onClick={handleClick} />;
};
```

### Event Handlers

```tsx
// ❌ RUIM: Criar função inline
<Button onClick={() => handleClick(id)}>Click</Button>

// ✅ BOM: Use useCallback ou curry
const handleClick = useCallback((id) => {
  // handle click
}, []);

<Button onClick={() => handleClick(id)}>Click</Button>
```

### List Rendering

```tsx
// ❌ RUIM: Usar index como key
items.map((item, index) => <Item key={index} {...item} />)

// ✅ BOM: Usar ID único
items.map((item) => <Item key={item.id} {...item} />)
```

### Image Optimization

```tsx
// ✅ BOM: Lazy load de imagens
<img loading="lazy" src={url} alt="description" />

// ✅ BOM: Usar tamanhos apropriados
<img
  srcSet="image-320w.jpg 320w, image-640w.jpg 640w"
  sizes="(max-width: 640px) 100vw, 640px"
  src="image-640w.jpg"
/>
```

### Data Fetching

```tsx
// ✅ BOM: Usar skeleton loaders
import { TableSkeleton } from '@/components/common/skeletons';

const MyComponent = () => {
  const [loading, setLoading] = useState(true);

  if (loading) return <TableSkeleton />;
  return <Table data={data} />;
};
```

## 📦 Análise de Bundle

Para analisar o tamanho do bundle:

```bash
npm run build
```

Depois abra `dist/stats.html` no navegador para ver:
- Tamanho de cada chunk
- Dependências incluídas
- Visualização interativa do bundle

## 🎯 Métricas Alvo

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Build Metrics
- **Initial Bundle**: < 200KB (gzipped)
- **Vendor Chunks**: < 150KB cada
- **Route Chunks**: < 50KB cada

## 🔧 Ferramentas de Análise

### Chrome DevTools
1. **Lighthouse**: Audit automático
2. **Performance**: Profiling de runtime
3. **Network**: Análise de carregamento
4. **Coverage**: Código não utilizado

### Bundle Analysis
```bash
npm run build
# Abrir dist/stats.html
```

## 📝 Checklist de Performance

Antes de fazer deploy:

- [ ] Build de produção sem erros
- [ ] Bundle visualizer revisado
- [ ] Lighthouse score > 90
- [ ] Lazy loading implementado
- [ ] Imagens otimizadas
- [ ] Console.logs removidos
- [ ] Source maps desabilitados
- [ ] Gzip/Brotli habilitado no servidor

## 🔄 Monitoramento Contínuo

Recomendado integrar:
- **Sentry**: Error tracking
- **Google Analytics**: User behavior
- **Web Vitals**: Real user monitoring

## 📚 Recursos

- [Web Vitals](https://web.dev/vitals/)
- [React Performance](https://react.dev/learn/render-and-commit)
- [Vite Performance](https://vitejs.dev/guide/performance.html)
- [MUI Performance](https://mui.com/material-ui/guides/minimizing-bundle-size/)
