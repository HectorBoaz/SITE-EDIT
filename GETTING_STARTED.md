# Guia de Início Rápido - Astral Legacy

## 🚀 Primeiros Passos

### 1. Instalação

```bash
# Instale as dependências
npm install
```

### 2. Configure as Imagens

As imagens já foram copiadas para `public/images/`. Se precisar adicionar mais imagens:

```bash
# Windows PowerShell
Copy-Item assets/images/suaimagem.jpg -Destination public/images/

# Linux/Mac
cp assets/images/suaimagem.jpg public/images/
```

### 3. Execute o Projeto

```bash
# Modo de desenvolvimento
npm run dev
```

Acesse: http://localhost:3000

## 📝 Próximos Passos

### Configurar Autenticação

1. Escolha um provedor (ex: NextAuth.js, Clerk, Supabase)
2. Instale as dependências necessárias
3. Crie os arquivos de configuração em `src/lib/auth.ts`
4. Atualize as páginas `src/app/auth/page.tsx` e `src/app/registro/page.tsx`

### Configurar Pagamentos

1. Crie uma conta no Stripe
2. Adicione as chaves no arquivo `.env.local`:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```
3. Crie endpoints de API em `src/app/api/checkout/route.ts`
4. Configure webhooks do Stripe

### Configurar Banco de Dados

Opções recomendadas:
- **Vercel Postgres** (integrado com Vercel)
- **Supabase** (PostgreSQL com auth incluso)
- **PlanetScale** (MySQL serverless)
- **MongoDB Atlas** (NoSQL)

## 🎨 Personalização

### Cores e Estilos

Edite `src/app/globals.css`:
```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --dark-bg: rgb(1, 17, 26);
}
```

### Componentes

- **Navbar**: `src/components/Navbar.tsx`
- **Footer**: `src/components/Footer.tsx`

### Adicionar Nova Página

1. Crie pasta em `src/app/sua-pagina/`
2. Crie `page.tsx` dentro da pasta
3. Adicione link no Navbar

Exemplo:
```tsx
// src/app/sua-pagina/page.tsx
export default function SuaPagina() {
  return (
    <div className="container py-5">
      <h1>Sua Página</h1>
    </div>
  )
}
```

## 🐛 Debugging

### Verificar Erros

```bash
npm run lint
```

### Build de Produção

```bash
npm run build
```

Se houver erros, verifique:
- Imports corretos
- Tipagem TypeScript
- Imagens existem em `public/`

## 📦 Estrutura de Pastas

```
src/
├── app/              # Rotas (App Router)
│   ├── layout.tsx    # Layout global
│   ├── page.tsx      # Home page
│   └── [rota]/       # Outras páginas
├── components/       # Componentes reutilizáveis
└── app/globals.css   # Estilos globais

public/
└── images/          # Imagens estáticas
```

## 🚀 Deploy

### Vercel (Recomendado)

1. Instale Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Siga as instruções no terminal

### Outras Plataformas

- **Netlify**: Use o plugin Next.js
- **Cloudflare Pages**: Suporta Next.js
- **Railway**: Deploy direto do GitHub
- **DigitalOcean App Platform**: Suporta Next.js

## 📚 Recursos

- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação React](https://react.dev)
- [Documentação TypeScript](https://www.typescriptlang.org/docs)
- [Documentação Bootstrap](https://getbootstrap.com/docs)

## 💡 Dicas

1. **Hot Reload**: Salve os arquivos e veja as mudanças instantaneamente
2. **TypeScript**: Use tipos para evitar erros
3. **Components**: Crie componentes pequenos e reutilizáveis
4. **CSS Modules**: Use `.module.css` para estilos isolados
5. **Server Components**: Use por padrão, adicione 'use client' apenas quando necessário

## 🆘 Problemas Comuns

### Erro: Cannot find module

```bash
npm install
```

### Erro: Port 3000 already in use

```bash
# Use outra porta
npm run dev -- -p 3001
```

### Erro: Image optimization

Verifique se as imagens existem em `public/images/`

### Erro: TypeScript

```bash
# Verifique erros
npx tsc --noEmit
```

## 📧 Suporte

Se precisar de ajuda:
- Email: contato@astrallegacy.com
- Discord: discord.gg/astrallegacy

