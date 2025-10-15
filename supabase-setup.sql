-- =====================================================
-- ASTRAL LEGACY - SETUP COMPLETO DO BANCO DE DADOS
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- =====================================================
-- 1. TABELA DE PERFIS DE USUÁRIOS
-- =====================================================

-- Criar tabela de perfis
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL UNIQUE,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_nickname ON public.user_profiles(nickname);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON public.user_profiles(created_at);

-- Comentários para documentação
COMMENT ON TABLE public.user_profiles IS 'Perfis dos usuários do servidor Astral Legacy';
COMMENT ON COLUMN public.user_profiles.nickname IS 'Nickname usado no servidor de Minecraft';
COMMENT ON COLUMN public.user_profiles.phone IS 'Telefone do usuário (opcional)';
COMMENT ON COLUMN public.user_profiles.avatar_url IS 'URL do avatar do usuário';

-- =====================================================
-- 2. TABELA DE PLANOS VIP
-- =====================================================

-- Criar enum para tipos de VIP
DO $$ BEGIN
  CREATE TYPE vip_plan_type AS ENUM ('cosmo', 'astral', 'legacy');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Criar enum para status de assinatura
DO $$ BEGIN
  CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired', 'pending');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Criar tabela de assinaturas VIP
CREATE TABLE IF NOT EXISTS public.vip_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type vip_plan_type NOT NULL,
  status subscription_status DEFAULT 'pending',
  price DECIMAL(10, 2) NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  auto_renew BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cancelled_at TIMESTAMP WITH TIME ZONE
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_vip_subscriptions_user_id ON public.vip_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_vip_subscriptions_status ON public.vip_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_vip_subscriptions_end_date ON public.vip_subscriptions(end_date);
CREATE INDEX IF NOT EXISTS idx_vip_subscriptions_stripe_sub ON public.vip_subscriptions(stripe_subscription_id);

-- Comentários
COMMENT ON TABLE public.vip_subscriptions IS 'Assinaturas VIP dos usuários';
COMMENT ON COLUMN public.vip_subscriptions.plan_type IS 'Tipo de plano: cosmo, astral ou legacy';
COMMENT ON COLUMN public.vip_subscriptions.status IS 'Status da assinatura: active, cancelled, expired, pending';
COMMENT ON COLUMN public.vip_subscriptions.auto_renew IS 'Se a assinatura renova automaticamente';

-- =====================================================
-- 3. TABELA DE TRANSAÇÕES/COMPRAS
-- =====================================================

-- Criar enum para status de pagamento
DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Criar tabela de compras
CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.vip_subscriptions(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status payment_status DEFAULT 'pending',
  payment_method TEXT,
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_charge_id TEXT,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON public.purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON public.purchases(status);
CREATE INDEX IF NOT EXISTS idx_purchases_created_at ON public.purchases(created_at);
CREATE INDEX IF NOT EXISTS idx_purchases_stripe_intent ON public.purchases(stripe_payment_intent_id);

-- Comentários
COMMENT ON TABLE public.purchases IS 'Histórico de compras e transações';
COMMENT ON COLUMN public.purchases.status IS 'Status do pagamento: pending, completed, failed, refunded';
COMMENT ON COLUMN public.purchases.metadata IS 'Dados adicionais da transação em JSON';

-- =====================================================
-- 4. TABELA DE LOGS DE SERVIDOR
-- =====================================================

CREATE TABLE IF NOT EXISTS public.server_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_server_logs_user_id ON public.server_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_server_logs_action ON public.server_logs(action);
CREATE INDEX IF NOT EXISTS idx_server_logs_created_at ON public.server_logs(created_at);

-- Comentários
COMMENT ON TABLE public.server_logs IS 'Logs de ações no sistema';
COMMENT ON COLUMN public.server_logs.action IS 'Tipo de ação realizada';

-- =====================================================
-- 5. HABILITAR ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vip_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.server_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 6. POLÍTICAS DE SEGURANÇA - USER PROFILES
-- =====================================================

-- Usuários podem ver apenas seu próprio perfil
CREATE POLICY "Users can view own profile" 
  ON public.user_profiles 
  FOR SELECT 
  USING (auth.uid() = id);

-- Usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "Users can update own profile" 
  ON public.user_profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Permitir inserção durante o registro (via trigger)
CREATE POLICY "Enable insert for service role" 
  ON public.user_profiles 
  FOR INSERT 
  WITH CHECK (true);

-- =====================================================
-- 7. POLÍTICAS DE SEGURANÇA - VIP SUBSCRIPTIONS
-- =====================================================

-- Usuários podem ver suas próprias assinaturas
CREATE POLICY "Users can view own subscriptions" 
  ON public.vip_subscriptions 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Apenas service role pode inserir (via API)
CREATE POLICY "Service role can insert subscriptions" 
  ON public.vip_subscriptions 
  FOR INSERT 
  WITH CHECK (true);

-- Usuários podem cancelar suas assinaturas
CREATE POLICY "Users can cancel own subscriptions" 
  ON public.vip_subscriptions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- =====================================================
-- 8. POLÍTICAS DE SEGURANÇA - PURCHASES
-- =====================================================

-- Usuários podem ver suas próprias compras
CREATE POLICY "Users can view own purchases" 
  ON public.purchases 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Apenas service role pode inserir (via webhook)
CREATE POLICY "Service role can insert purchases" 
  ON public.purchases 
  FOR INSERT 
  WITH CHECK (true);

-- =====================================================
-- 9. POLÍTICAS DE SEGURANÇA - SERVER LOGS
-- =====================================================

-- Usuários podem ver apenas seus próprios logs
CREATE POLICY "Users can view own logs" 
  ON public.server_logs 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Permitir inserção de logs
CREATE POLICY "Enable insert for authenticated users" 
  ON public.server_logs 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- =====================================================
-- 10. FUNÇÕES E TRIGGERS
-- =====================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para user_profiles
DROP TRIGGER IF EXISTS set_updated_at_user_profiles ON public.user_profiles;
CREATE TRIGGER set_updated_at_user_profiles
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger para vip_subscriptions
DROP TRIGGER IF EXISTS set_updated_at_vip_subscriptions ON public.vip_subscriptions;
CREATE TRIGGER set_updated_at_vip_subscriptions
  BEFORE UPDATE ON public.vip_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger para purchases
DROP TRIGGER IF EXISTS set_updated_at_purchases ON public.purchases;
CREATE TRIGGER set_updated_at_purchases
  BEFORE UPDATE ON public.purchases
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- 11. FUNÇÃO PARA CRIAR PERFIL AUTOMATICAMENTE
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, nickname, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nickname', 'User' || substring(NEW.id::text from 1 for 8)),
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil ao registrar usuário
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 12. FUNÇÃO PARA VERIFICAR SE USUÁRIO TEM VIP ATIVO
-- =====================================================

CREATE OR REPLACE FUNCTION public.user_has_active_vip(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.vip_subscriptions 
    WHERE user_id = user_uuid 
      AND status = 'active' 
      AND end_date > NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 13. FUNÇÃO PARA OBTER PLANO VIP ATUAL DO USUÁRIO
-- =====================================================

CREATE OR REPLACE FUNCTION public.get_user_current_vip(user_uuid UUID)
RETURNS vip_plan_type AS $$
DECLARE
  current_plan vip_plan_type;
BEGIN
  SELECT plan_type INTO current_plan
  FROM public.vip_subscriptions
  WHERE user_id = user_uuid 
    AND status = 'active' 
    AND end_date > NOW()
  ORDER BY end_date DESC
  LIMIT 1;
  
  RETURN current_plan;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 14. VIEW PARA USUÁRIOS COM VIP ATIVO
-- =====================================================

CREATE OR REPLACE VIEW public.active_vip_users AS
SELECT 
  up.id,
  up.nickname,
  up.phone,
  vs.plan_type,
  vs.start_date,
  vs.end_date,
  vs.auto_renew
FROM public.user_profiles up
INNER JOIN public.vip_subscriptions vs ON up.id = vs.user_id
WHERE vs.status = 'active' 
  AND vs.end_date > NOW();

-- Comentário
COMMENT ON VIEW public.active_vip_users IS 'View com todos os usuários que possuem VIP ativo';

-- =====================================================
-- 15. DADOS DE EXEMPLO (OPCIONAL - PARA TESTES)
-- =====================================================

-- Descomentar as linhas abaixo se quiser inserir dados de teste

/*
-- Inserir perfil de teste (após criar um usuário via interface)
-- Substitua 'YOUR-USER-UUID' pelo UUID real do usuário criado
INSERT INTO public.user_profiles (id, nickname, phone) 
VALUES ('YOUR-USER-UUID', 'TestUser', '11999999999');

-- Inserir assinatura VIP de teste
INSERT INTO public.vip_subscriptions (
  user_id, 
  plan_type, 
  status, 
  price, 
  start_date, 
  end_date
) VALUES (
  'YOUR-USER-UUID',
  'astral',
  'active',
  49.90,
  NOW(),
  NOW() + INTERVAL '30 days'
);
*/

-- =====================================================
-- 16. GRANT PERMISSIONS
-- =====================================================

-- Garantir que o service role possa acessar tudo
GRANT ALL ON public.user_profiles TO service_role;
GRANT ALL ON public.vip_subscriptions TO service_role;
GRANT ALL ON public.purchases TO service_role;
GRANT ALL ON public.server_logs TO service_role;

-- Garantir que usuários autenticados possam ler
GRANT SELECT ON public.user_profiles TO authenticated;
GRANT SELECT ON public.vip_subscriptions TO authenticated;
GRANT SELECT ON public.purchases TO authenticated;
GRANT SELECT ON public.server_logs TO authenticated;

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================
-- Verificar se tudo foi criado corretamente:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
-- =====================================================

-- Mensagem de sucesso
DO $$ 
BEGIN 
  RAISE NOTICE '✅ Banco de dados configurado com sucesso!';
  RAISE NOTICE '📊 Tabelas criadas: user_profiles, vip_subscriptions, purchases, server_logs';
  RAISE NOTICE '🔒 RLS habilitado em todas as tabelas';
  RAISE NOTICE '⚡ Triggers e funções configurados';
  RAISE NOTICE '👤 Perfis serão criados automaticamente ao registrar';
END $$;

