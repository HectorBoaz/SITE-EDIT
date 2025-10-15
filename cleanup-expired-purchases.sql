-- =====================================================
-- FUNÇÃO PARA LIMPEZA AUTOMÁTICA DE COMPRAS EXPIRADAS
-- =====================================================
-- Execute este script no SQL Editor do Supabase

-- Função para cancelar compras expiradas
CREATE OR REPLACE FUNCTION cleanup_expired_purchases()
RETURNS void AS $$
BEGIN
  -- Cancelar compras pendentes que expiraram
  UPDATE public.purchases 
  SET status = 'cancelled'
  WHERE status = 'pending' 
    AND pix_expires_at < NOW()
    AND pix_expires_at IS NOT NULL;
    
  -- Log das compras canceladas
  INSERT INTO public.audit_log (action, table_name, description, created_at)
  SELECT 
    'CLEANUP',
    'purchases',
    'Canceled ' || COUNT(*) || ' expired purchases',
    NOW()
  FROM public.purchases 
  WHERE status = 'cancelled' 
    AND updated_at > NOW() - INTERVAL '1 minute';
    
END;
$$ LANGUAGE plpgsql;

-- Criar tabela de log de auditoria (se não existir)
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Executar limpeza imediatamente
SELECT cleanup_expired_purchases();

-- Verificar compras expiradas
SELECT 
  id,
  plan_type,
  amount,
  status,
  created_at,
  pix_expires_at,
  CASE 
    WHEN pix_expires_at < NOW() THEN 'EXPIRADO'
    ELSE 'VÁLIDO'
  END as status_pix
FROM public.purchases 
WHERE status = 'pending'
ORDER BY created_at DESC;
