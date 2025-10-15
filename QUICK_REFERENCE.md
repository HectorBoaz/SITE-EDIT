# 🚀 Referência Rápida - Astral Legacy

## Comandos Essenciais

```bash
# Instalar dependências
npm install

# Iniciar desenvolvimento
npm run dev

# Build de produção
npm run build
npm start

# Verificar erros
npm run lint
npm run type-check

# Verificar configuração
npm run setup
```

## Estrutura de Rotas

| URL | Arquivo | Descrição |
|-----|---------|-----------|
| `/` | `src/app/page.tsx` | Página inicial |
| `/auth` | `src/app/auth/page.tsx` | Login |
| `/registro` | `src/app/registro/page.tsx` | Criar conta |
| `/loja` | `src/app/loja/page.tsx` | Planos VIP |
| `/regras` | `src/app/regras/page.tsx` | Regras do servidor |
| `/como-entrar` | `src/app/como-entrar/page.tsx` | Tutorial |
| `/privacidade` | `src/app/privacidade/page.tsx` | Política de privacidade |
| `/termos` | `src/app/termos/page.tsx` | Termos de serviço |
| `/imprint` | `src/app/imprint/page.tsx` | Impressum |

## Componentes Principais

```tsx
// Importar componentes
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

// Layout está em src/app/layout.tsx
```

## Adicionar Nova Página

1. Criar pasta em `src/app/`:
```bash
mkdir src/app/sua-pagina
```

2. Criar `page.tsx`:
```tsx
// src/app/sua-pagina/page.tsx
export default function SuaPagina() {
  return (
    <div className="container py-5" style={{ marginTop: '80px' }}>
      <h1>Sua Página</h1>
    </div>
  )
}
```

3. Adicionar link no Navbar:
```tsx
// src/components/Navbar.tsx
<Link href="/sua-pagina" className="nav-link">
  Sua Página
</Link>
```

## Adicionar Imagem

1. Colocar em `public/images/`
2. Usar componente Image:

```tsx
import Image from 'next/image'

<Image 
  src="/images/sua-imagem.jpg"
  alt="Descrição"
  width={500}
  height={300}
/>
```

## Estilos

### Classes Bootstrap Disponíveis
```tsx
// Containers
<div className="container">
<div className="container-fluid">

// Grid
<div className="row">
<div className="col-md-6">

// Botões
<button className="btn btn-primary">
<button className="btn btn-secondary">

// Cards
<div className="card">
  <div className="card-body">
```

### Estilos Customizados
```tsx
// Inline
<div style={{ backgroundColor: '#000' }}>

// Classes CSS (globals.css)
<div className="sua-classe">
```

## TypeScript

### Props de Componente
```tsx
interface Props {
  title: string
  count?: number  // opcional
}

export default function Component({ title, count = 0 }: Props) {
  return <div>{title}: {count}</div>
}
```

### State
```tsx
'use client'  // Necessário para hooks

import { useState } from 'react'

export default function Component() {
  const [value, setValue] = useState<string>('')
  
  return (
    <input 
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}
```

## Metadata (SEO)

```tsx
// src/app/sua-pagina/page.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Título da Página',
  description: 'Descrição para SEO',
}

export default function Page() {
  // ...
}
```

## Client vs Server Components

### Server Component (Padrão)
```tsx
// Sem 'use client'
// Não pode usar hooks (useState, useEffect, etc)
// Melhor para SEO e performance

export default function ServerComponent() {
  return <div>Server Component</div>
}
```

### Client Component
```tsx
'use client'  // Adicionar no topo

// Pode usar hooks
// Necessário para interatividade

import { useState } from 'react'

export default function ClientComponent() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

## Variáveis de Ambiente

```bash
# .env.local (criar este arquivo)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_KEY=sua-chave

# Usar no código
const url = process.env.NEXT_PUBLIC_SITE_URL
```

**Importante**: Variáveis públicas devem começar com `NEXT_PUBLIC_`

## Troubleshooting

### Erro: Cannot find module
```bash
npm install
```

### Erro: Port 3000 in use
```bash
npm run dev -- -p 3001
```

### Erro: TypeScript
```bash
npm run type-check
```

### Limpar cache
```bash
rm -rf .next
npm run dev
```

### Reinstalar tudo
```bash
rm -rf node_modules package-lock.json
npm install
```

## Git

```bash
# Status
git status

# Adicionar mudanças
git add .

# Commit
git commit -m "Descrição das mudanças"

# Push
git push origin main

# Pull
git pull origin main
```

## Deploy Rápido (Vercel)

```bash
# Instalar CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

## Links Úteis

- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação React](https://react.dev)
- [Documentação TypeScript](https://www.typescriptlang.org/docs)
- [Documentação Bootstrap](https://getbootstrap.com/docs)
- [Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)

## Atalhos VSCode

- `Ctrl + P` - Buscar arquivo
- `Ctrl + Shift + F` - Buscar em todos os arquivos
- `F2` - Renomear símbolo
- `Ctrl + Space` - Autocompletar
- `Alt + Up/Down` - Mover linha

## Arquivo Importante

| Arquivo | Descrição |
|---------|-----------|
| `package.json` | Dependências e scripts |
| `tsconfig.json` | Config TypeScript |
| `next.config.js` | Config Next.js |
| `src/app/layout.tsx` | Layout global |
| `src/app/globals.css` | Estilos globais |
| `.env.local` | Variáveis de ambiente (criar) |

## Checklist Antes de Commitar

- [ ] `npm run lint` sem erros
- [ ] `npm run type-check` sem erros
- [ ] `npm run build` funciona
- [ ] Testado localmente
- [ ] Código formatado

## Suporte

📧 contato@astrallegacy.com  
💬 discord.gg/astrallegacy

---

**Dica**: Salve este arquivo nos favoritos para consulta rápida!

