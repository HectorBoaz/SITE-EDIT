# 🚀 Guia de Configuração do Supabase - Astral Legacy

## 📋 Passo a Passo

### 1️⃣ Acessar o Painel do Supabase

1. Vá para [https://supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Selecione seu projeto (ou crie um novo)

### 2️⃣ Abrir o SQL Editor

1. No painel lateral esquerdo, clique em **"SQL Editor"**
2. Clique em **"New query"** (Nova consulta)

### 3️⃣ Executar o Script SQL

1. **Abra o arquivo** `supabase-setup.sql`
2. **Copie TODO o conteúdo** (Ctrl+A, Ctrl+C)
3. **Cole no SQL Editor** do Supabase (Ctrl+V)
4. **Clique em "Run"** (ou pressione Ctrl+Enter)

⏱️ **Tempo de execução**: ~10-30 segundos

### 4️⃣ Verificar se Deu Certo

No SQL Editor, execute este comando para verificar as tabelas:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Você deve ver estas tabelas:
- ✅ `user_profiles`
- ✅ `vip_subscriptions`
- ✅ `purchases`
- ✅ `server_logs`

### 5️⃣ Verificar Políticas de Segurança (RLS)

Execute este comando:

```sql
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

Você deve ver várias políticas criadas para cada tabela.

## 📊 Estrutura das Tabelas Criadas

### 🧑 `user_profiles` - Perfis dos Usuários
```
- id (UUID) - ID do usuário (referência para auth.users)
- nickname (TEXT) - Nickname no Minecraft
- phone (TEXT) - Telefone (opcional)
- avatar_url (TEXT) - URL do avatar
- created_at - Data de criação
- updated_at - Data de atualização
```

**Automático**: Quando um usuário se registra, o perfil é criado automaticamente!

### 💎 `vip_subscriptions` - Assinaturas VIP
```
- id (UUID) - ID da assinatura
- user_id (UUID) - ID do usuário
- plan_type (ENUM) - Tipo: 'cosmo', 'astral', ou 'legacy'
- status (ENUM) - Status: 'active', 'cancelled', 'expired', 'pending'
- price (DECIMAL) - Preço pago
- start_date - Data de início
- end_date - Data de término
- stripe_subscription_id - ID no Stripe
- stripe_customer_id - ID do cliente no Stripe
- auto_renew (BOOLEAN) - Renovação automática
- created_at - Data de criação
- updated_at - Data de atualização
- cancelled_at - Data de cancelamento
```

### 💳 `purchases` - Histórico de Compras
```
- id (UUID) - ID da compra
- user_id (UUID) - ID do usuário
- subscription_id (UUID) - Referência para a assinatura
- amount (DECIMAL) - Valor pago
- status (ENUM) - 'pending', 'completed', 'failed', 'refunded'
- payment_method - Método de pagamento
- stripe_payment_intent_id - ID do pagamento no Stripe
- stripe_charge_id - ID da cobrança no Stripe
- description - Descrição da compra
- metadata (JSONB) - Dados extras em JSON
- created_at - Data da compra
- updated_at - Data de atualização
```

### 📝 `server_logs` - Logs de Ações
```
- id (UUID) - ID do log
- user_id (UUID) - Usuário que fez a ação
- action (TEXT) - Tipo de ação
- details (JSONB) - Detalhes em JSON
- ip_address (INET) - IP do usuário
- user_agent (TEXT) - Navegador/dispositivo
- created_at - Data da ação
```

## 🔒 Segurança (RLS)

Todas as tabelas têm **Row Level Security (RLS)** ativado:

- ✅ Usuários só veem seus próprios dados
- ✅ Usuários não podem ver dados de outros usuários
- ✅ API do servidor pode acessar tudo (via service_role)

## ⚡ Funções Automáticas

### 1. Criação Automática de Perfil
Quando um usuário se registra, o perfil é criado automaticamente na tabela `user_profiles`.

### 2. Atualização Automática de `updated_at`
Sempre que você atualiza um registro, o campo `updated_at` é atualizado automaticamente.

### 3. Verificar se Usuário Tem VIP
```sql
SELECT user_has_active_vip('USER-UUID-AQUI');
```

### 4. Obter Plano VIP Atual
```sql
SELECT get_user_current_vip('USER-UUID-AQUI');
```

## 🧪 Testar a Configuração

### 1. Criar um Usuário de Teste

1. Vá para `http://localhost:3001/registro` (ou 3000)
2. Crie uma conta com:
   - Nickname: `TestUser`
   - Email: `test@example.com`
   - Senha: `123456`

### 2. Verificar no Supabase

No SQL Editor, execute:

```sql
-- Ver todos os perfis criados
SELECT * FROM public.user_profiles;

-- Ver usuários do auth
SELECT id, email, created_at FROM auth.users;
```

Você deve ver seu usuário de teste!

### 3. Inserir VIP de Teste (Opcional)

```sql
-- Substitua 'USER-UUID' pelo ID real do seu usuário
INSERT INTO public.vip_subscriptions (
  user_id, 
  plan_type, 
  status, 
  price, 
  start_date, 
  end_date
) VALUES (
  'USER-UUID-AQUI',
  'astral',
  'active',
  49.90,
  NOW(),
  NOW() + INTERVAL '30 days'
);
```

### 4. Verificar VIP

```sql
-- Ver todos os VIPs ativos
SELECT * FROM public.active_vip_users;

-- Verificar se um usuário específico tem VIP
SELECT user_has_active_vip('USER-UUID-AQUI');
```

## 📚 Consultas Úteis

### Ver Perfis com seus VIPs
```sql
SELECT 
  up.nickname,
  up.phone,
  vs.plan_type,
  vs.status,
  vs.end_date
FROM user_profiles up
LEFT JOIN vip_subscriptions vs ON up.id = vs.user_id
ORDER BY up.created_at DESC;
```

### Ver Últimas Compras
```sql
SELECT 
  up.nickname,
  p.amount,
  p.status,
  p.created_at
FROM purchases p
JOIN user_profiles up ON p.user_id = up.id
ORDER BY p.created_at DESC
LIMIT 10;
```

### Ver VIPs que Expiram nos Próximos 7 Dias
```sql
SELECT 
  up.nickname,
  up.phone,
  vs.plan_type,
  vs.end_date
FROM vip_subscriptions vs
JOIN user_profiles up ON vs.user_id = up.id
WHERE vs.status = 'active'
  AND vs.end_date BETWEEN NOW() AND NOW() + INTERVAL '7 days'
ORDER BY vs.end_date;
```

### Estatísticas Gerais
```sql
SELECT 
  COUNT(*) as total_users,
  (SELECT COUNT(*) FROM vip_subscriptions WHERE status = 'active') as active_vips,
  (SELECT SUM(amount) FROM purchases WHERE status = 'completed') as total_revenue
FROM user_profiles;
```

## 🔧 Comandos de Manutenção

### Limpar Assinaturas Expiradas
```sql
UPDATE vip_subscriptions 
SET status = 'expired'
WHERE status = 'active' 
  AND end_date < NOW();
```

### Ver Logs Recentes
```sql
SELECT 
  up.nickname,
  sl.action,
  sl.created_at
FROM server_logs sl
JOIN user_profiles up ON sl.user_id = up.id
ORDER BY sl.created_at DESC
LIMIT 20;
```

## ❓ Problemas Comuns

### Erro: "permission denied for table user_profiles"
**Solução**: Execute a seção de GRANT PERMISSIONS do script novamente.

### Erro: "relation user_profiles already exists"
**Solução**: Isso é normal se você executar o script duas vezes. O script usa `IF NOT EXISTS`.

### Perfil não é criado automaticamente ao registrar
**Solução**: Verifique se o trigger está ativo:
```sql
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
```

### RLS bloqueia acesso via API
**Solução**: Use o `service_role` key (não a `anon` key) para operações administrativas.

## 🎯 Próximos Passos

Depois de criar as tabelas:

1. ✅ Testar registro de usuário
2. ✅ Testar login
3. ⏳ Implementar página de perfil do usuário
4. ⏳ Integrar Stripe para pagamentos VIP
5. ⏳ Criar painel administrativo

## 📞 Ajuda

Se tiver problemas:
1. Verifique os logs no painel do Supabase
2. Teste as consultas SQL acima
3. Verifique se o RLS está configurado corretamente

---

**✅ Banco de dados pronto para produção!** 🚀

