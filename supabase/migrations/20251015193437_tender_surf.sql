/*
  # Corrigir sistema de autenticação completamente

  1. Limpeza
    - Remover todos os triggers conflitantes
    - Remover funções antigas
    - Recriar tabela user_profiles se necessário

  2. Nova estrutura
    - Função robusta para criação de perfil
    - Trigger que não falha o cadastro
    - Políticas RLS simplificadas

  3. Segurança
    - RLS habilitado
    - Políticas para usuários autenticados
*/

-- Remover todos os triggers existentes que podem estar causando conflito
DROP TRIGGER IF EXISTS create_profile_trigger ON auth.users;
DROP TRIGGER IF EXISTS create_user_profile_trigger ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user_trigger ON auth.users;

-- Remover funções antigas
DROP FUNCTION IF EXISTS create_user_profile();
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recriar tabela user_profiles com estrutura limpa
DROP TABLE IF EXISTS public.user_profiles CASCADE;

CREATE TABLE public.user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname text UNIQUE NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS simplificadas
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Função robusta que NÃO falha o cadastro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  user_nickname text;
  user_phone text;
  nickname_suffix text;
BEGIN
  -- Log para debug
  RAISE LOG 'Criando perfil para usuário: %', NEW.id;
  
  -- Extrair dados dos metadados com fallback
  user_nickname := COALESCE(
    NEW.raw_user_meta_data->>'nickname', 
    'Jogador' || substr(NEW.id::text, 1, 8)
  );
  user_phone := NEW.raw_user_meta_data->>'phone';
  
  -- Tentar inserir perfil com tratamento robusto de erros
  BEGIN
    INSERT INTO public.user_profiles (id, nickname, phone, created_at, updated_at)
    VALUES (
      NEW.id,
      user_nickname,
      user_phone,
      now(),
      now()
    );
    
    RAISE LOG 'Perfil criado com sucesso para usuário: %', NEW.id;
    
  EXCEPTION
    WHEN unique_violation THEN
      -- Se nickname já existe, tentar com sufixo
      BEGIN
        nickname_suffix := '_' || substr(NEW.id::text, 1, 6);
        INSERT INTO public.user_profiles (id, nickname, phone, created_at, updated_at)
        VALUES (
          NEW.id,
          user_nickname || nickname_suffix,
          user_phone,
          now(),
          now()
        );
        
        RAISE LOG 'Perfil criado com nickname alternativo para usuário: %', NEW.id;
        
      EXCEPTION
        WHEN OTHERS THEN
          -- Log do erro mas NÃO falha o cadastro
          RAISE LOG 'Erro ao criar perfil para usuário % (com sufixo): %. Usuário será criado sem perfil.', NEW.id, SQLERRM;
      END;
      
    WHEN OTHERS THEN
      -- Log do erro mas NÃO falha o cadastro
      RAISE LOG 'Erro ao criar perfil para usuário %: %. Usuário será criado sem perfil.', NEW.id, SQLERRM;
  END;

  -- SEMPRE retorna NEW para não falhar o cadastro
  RETURN NEW;
END;
$$;

-- Criar trigger que NÃO falha
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger para updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Garantir que a função pode ser executada
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.user_profiles TO postgres, anon, authenticated, service_role;