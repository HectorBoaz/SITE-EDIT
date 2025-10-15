# Guia de Migração - HTML para Next.js

## 📋 Resumo das Mudanças

Este projeto foi migrado de um site HTML estático para uma aplicação Next.js moderna com TypeScript.

### O que foi removido ✂️

- ✅ **Configurações do Supabase** - Todas as referências foram removidas
- ✅ **Arquivos da pasta supabase/** - Migrations e functions foram deletados
- ✅ **Scripts do Supabase** - Removidos dos arquivos HTML

### O que foi criado 🎉

- ✅ **Estrutura Next.js 14** com App Router
- ✅ **TypeScript** configurado
- ✅ **Componentes React** modernos
- ✅ **Bootstrap 5** via React Bootstrap
- ✅ **Páginas convertidas**:
  - index.html → src/app/page.tsx
  - auth.html → src/app/auth/page.tsx
  - register.html → src/app/registro/page.tsx
  - shop.html → src/app/loja/page.tsx
  - rules.html → src/app/regras/page.tsx
  - como-entrar.html → src/app/como-entrar/page.tsx
  - privacy.html → src/app/privacidade/page.tsx
  - tos.html → src/app/termos/page.tsx
  - imprint.html → src/app/imprint/page.tsx

## 🔄 Comparação: Antes vs Depois

### Antes (HTML Estático)
```html
<!-- index.html -->
<html>
  <head>
    <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css">
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  </head>
  <body>
    <section>...</section>
    <script>
      const supabase = window.supabase.createClient(url, key);
    </script>
  </body>
</html>
```

### Depois (Next.js + TypeScript)
```tsx
// src/app/page.tsx
export default function Home() {
  return (
    <section className="container">
      {/* Conteúdo */}
    </section>
  )
}
```

## 📂 Mapeamento de Arquivos

| Arquivo Antigo | Arquivo Novo | Status |
|---|---|---|
| `index.html` | `src/app/page.tsx` | ✅ Convertido |
| `auth.html` | `src/app/auth/page.tsx` | ✅ Convertido |
| `register.html` | `src/app/registro/page.tsx` | ✅ Convertido |
| `shop.html` | `src/app/loja/page.tsx` | ✅ Convertido |
| `rules.html` | `src/app/regras/page.tsx` | ✅ Convertido |
| `como-entrar.html` | `src/app/como-entrar/page.tsx` | ✅ Convertido |
| `privacy.html` | `src/app/privacidade/page.tsx` | ✅ Convertido |
| `tos.html` | `src/app/termos/page.tsx` | ✅ Convertido |
| `imprint.html` | `src/app/imprint/page.tsx` | ✅ Convertido |
| `assets/` | `public/images/` | ✅ Mantido |

## 🎨 Estilos

### Antes
```html
<link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css">
<link rel="stylesheet" href="assets/theme/css/style.css">
```

### Depois
```tsx
// src/app/layout.tsx
import 'bootstrap/dist/css/bootstrap.min.css'
import './globals.css'
```

Os estilos foram consolidados em:
- `src/app/globals.css` - Estilos globais
- Bootstrap 5 via npm

## 🔌 Funcionalidades Desativadas

### Autenticação
**Status**: Temporariamente desativada

**Antes**: Supabase Auth
```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email, password
})
```

**Agora**: Placeholder
```typescript
// Funcionalidade temporariamente desativada
alert('Entre em contato com o suporte')
```

**Para reativar**:
1. Escolha um provedor (NextAuth.js, Clerk, etc)
2. Configure em `src/lib/auth.ts`
3. Atualize as páginas de auth e registro

### Pagamentos
**Status**: Estrutura mantida, precisa configuração

**Antes**: Stripe + Supabase Edge Functions
```javascript
const response = await fetch(`${supabaseUrl}/functions/v1/create-checkout-session`, {
  // ...
})
```

**Agora**: Precisa implementar API Routes
```typescript
// TODO: Criar src/app/api/checkout/route.ts
// TODO: Configurar Stripe webhooks
```

## 🚀 Como Reativar Funcionalidades

### 1. Autenticação com NextAuth.js

```bash
npm install next-auth
```

```typescript
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  providers: [
    CredentialsProvider({
      // Configure seu provider
    })
  ]
}

export default NextAuth(authOptions)
```

### 2. Banco de Dados com Prisma

```bash
npm install prisma @prisma/client
npx prisma init
```

```prisma
// prisma/schema.prisma
model User {
  id       String @id @default(cuid())
  email    String @unique
  nickname String
  phone    String?
}
```

### 3. Pagamentos com Stripe

```bash
npm install stripe @stripe/stripe-js
```

```typescript
// src/app/api/checkout/route.ts
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { planType, price } = await req.json()
  
  const session = await stripe.checkout.sessions.create({
    // Configure a sessão
  })
  
  return NextResponse.json({ id: session.id })
}
```

## 📊 Benefícios da Migração

### Performance
- ⚡ **Renderização Otimizada**: Server Components por padrão
- ⚡ **Code Splitting**: Carregamento de código sob demanda
- ⚡ **Image Optimization**: Imagens otimizadas automaticamente

### Desenvolvimento
- 🔧 **TypeScript**: Detecção de erros em tempo de desenvolvimento
- 🔧 **Hot Reload**: Mudanças instantâneas
- 🔧 **Componentes Reutilizáveis**: Navbar e Footer compartilhados

### SEO
- 🔍 **Server-Side Rendering**: Melhor indexação
- 🔍 **Metadata API**: Controle fino de meta tags
- 🔍 **Sitemap Automático**: Geração automática

### Manutenção
- 🛠️ **Código Modular**: Fácil de manter
- 🛠️ **Testes**: Mais fácil de testar
- 🛠️ **Versionamento**: Melhor controle de dependências

## ⚠️ Pontos de Atenção

### 1. Arquivos HTML Antigos
Os arquivos HTML originais foram mantidos, mas não são mais usados. Considere:
- Criar uma pasta `_legacy/` e mover os HTMLs para lá
- Ou deletar após confirmar que tudo funciona

### 2. Assets
As imagens foram copiadas para `public/images/`. Os arquivos em `assets/images/` podem ser removidos.

### 3. Scripts Externos
Alguns scripts (parallax, smooth scroll) não foram migrados. Se necessário, instale versões React:

```bash
npm install react-scroll
npm install react-intersection-observer
```

## 📝 Checklist de Migração

- [x] Criar estrutura Next.js
- [x] Configurar TypeScript
- [x] Migrar todas as páginas
- [x] Criar componentes Navbar e Footer
- [x] Copiar imagens para public/
- [x] Remover configurações Supabase
- [ ] Configurar novo sistema de autenticação
- [ ] Configurar banco de dados
- [ ] Implementar API de pagamentos
- [ ] Configurar emails transacionais
- [ ] Testes de integração
- [ ] Deploy em produção

## 🎯 Próximos Passos Recomendados

1. **Instalar dependências**: `npm install`
2. **Testar localmente**: `npm run dev`
3. **Configurar autenticação** (ver guia acima)
4. **Configurar banco de dados** (Prisma + PostgreSQL)
5. **Implementar pagamentos** (Stripe)
6. **Deploy** (Vercel recomendado)

## 📞 Suporte

Se tiver dúvidas sobre a migração:
- Consulte `GETTING_STARTED.md`
- Veja `README.md`
- Contato: contato@astrallegacy.com

