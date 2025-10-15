# Astral Legacy - Servidor de Minecraft

Site oficial do servidor de Minecraft Astral Legacy, desenvolvido com Next.js 14, React 18, TypeScript e Bootstrap 5.

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router
- **React 18** - Biblioteca JavaScript para interfaces
- **TypeScript** - Superset JavaScript com tipagem estática
- **Bootstrap 5** - Framework CSS para design responsivo
- **Sass** - Pré-processador CSS

## 📋 Pré-requisitos

- Node.js 18.0 ou superior
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd SITE-EDIT
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Copie as imagens para a pasta public:
```bash
# Crie a pasta public/images se não existir
mkdir -p public/images

# Copie as imagens da pasta assets/images para public/images
cp assets/images/*.png public/images/
cp assets/images/*.jpg public/images/
```

## 🎮 Como Executar

### Modo de Desenvolvimento
```bash
npm run dev
# ou
yarn dev
```

Acesse [http://localhost:3000](http://localhost:3000) para ver o site.

### Build de Produção
```bash
npm run build
npm start
# ou
yarn build
yarn start
```

## 📁 Estrutura do Projeto

```
SITE-EDIT/
├── src/
│   ├── app/                 # Páginas do Next.js (App Router)
│   │   ├── layout.tsx       # Layout principal
│   │   ├── page.tsx         # Página inicial
│   │   ├── auth/            # Página de login
│   │   ├── registro/        # Página de registro
│   │   ├── loja/            # Página da loja VIP
│   │   ├── regras/          # Regras do servidor
│   │   ├── como-entrar/     # Tutorial de conexão
│   │   ├── imprint/         # Informações legais
│   │   ├── privacidade/     # Política de privacidade
│   │   └── termos/          # Termos de serviço
│   ├── components/          # Componentes reutilizáveis
│   │   ├── Navbar.tsx       # Barra de navegação
│   │   └── Footer.tsx       # Rodapé
│   └── app/globals.css      # Estilos globais
├── public/                  # Arquivos estáticos
│   └── images/              # Imagens do site
├── package.json             # Dependências do projeto
├── tsconfig.json            # Configuração TypeScript
├── next.config.js           # Configuração Next.js
└── README.md               # Este arquivo
```

## 🎨 Funcionalidades

- ✅ Design responsivo e moderno
- ✅ Páginas de autenticação (Login/Registro)
- ✅ Loja VIP com 3 planos diferentes
- ✅ Página de regras do servidor
- ✅ Tutorial de como conectar ao servidor
- ✅ Páginas legais (Privacidade, Termos, Imprint)
- ✅ Navbar e Footer reutilizáveis
- ✅ Otimização de imagens com Next.js Image
- ✅ Tipagem TypeScript completa

## 🌟 Páginas

- **Home** (`/`) - Página inicial com informações do servidor
- **Login** (`/auth`) - Página de autenticação
- **Registro** (`/registro`) - Criação de conta
- **Loja** (`/loja`) - Planos VIP (Cosmo, Astral, Legacy)
- **Regras** (`/regras`) - Normas de conduta do servidor
- **Como Entrar** (`/como-entrar`) - Tutorial de conexão
- **Privacidade** (`/privacidade`) - Política de privacidade
- **Termos** (`/termos`) - Termos de serviço
- **Imprint** (`/imprint`) - Informações legais

## 🔐 Autenticação

Atualmente, as funcionalidades de login e registro estão desativadas (configurações do Supabase foram removidas). Para implementar autenticação:

1. Configure um provedor de autenticação (ex: NextAuth.js, Clerk, Auth0)
2. Atualize as páginas `src/app/auth/page.tsx` e `src/app/registro/page.tsx`
3. Implemente os endpoints de API necessários

## 💳 Sistema de Pagamento

O sistema de pagamento Stripe está configurado, mas precisa de:

1. Chaves de API do Stripe configuradas
2. Endpoints de API para processar pagamentos
3. Webhook para confirmar pagamentos

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

### Outros Provedores
1. Faça o build: `npm run build`
2. Suba a pasta `.next` e `public` para seu servidor
3. Execute: `npm start`

## 📝 Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Exemplo de variáveis que você pode precisar
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SERVER_IP=play.astrallegacy.com
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e pertence ao Astral Legacy.

## 📧 Contato

- Email: contato@astrallegacy.com
- Discord: discord.gg/astrallegacy
- Site: astrallegacy.com

---

Desenvolvido com ❤️ para a comunidade Astral Legacy

