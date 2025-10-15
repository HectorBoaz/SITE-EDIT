/*
  # Corrigir sistema de perfis de usuário

  1. Correções
    - Remover triggers conflitantes
    - Criar função mais robusta para criação de perfil
    - Simplificar processo de cadastro
    - Adicionar tratamento de erros

  2. Segurança
    - Manter RLS habilitado
    - Políticas de segurança atualizadas
*/

-- Remover triggers existentes que podem estar causando conflito
DROP TRIGGER IF EXISTS create_profile_trigger ON auth.users;
DROP TRIGGER IF EXISTS create_user_profile_trigger ON auth.users;

-- Remover função antiga se existir
DROP FUNCTION IF EXISTS create_user_profile();

-- Criar função mais robusta para criação de perfil
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_nickname text;
  user_phone text;
BEGIN
  -- Extrair dados dos metadados
  user_nickname := COALESCE(NEW.raw_user_meta_data->>'nickname', 'Jogador' || substr(NEW.id::text, 1, 8));
  user_phone := NEW.raw_user_meta_data->>'phone';

  -- Inserir perfil do usuário com tratamento de erro
  BEGIN
    INSERT INTO user_profiles (id, nickname, phone, created_at, updated_at)
    VALUES (
      NEW.id,
      user_nickname,
      user_phone,
      now(),
      now()
    );
  EXCEPTION
    WHEN unique_violation THEN
      -- Se nickname já existe, adicionar sufixo único
      INSERT INTO user_profiles (id, nickname, phone, created_at, updated_at)
      VALUES (
        NEW.id,
        user_nickname || '_' || substr(NEW.id::text, 1, 4),
        user_phone,
        now(),
        now()
      );
    WHEN OTHERS THEN
      -- Log do erro mas não falha o cadastro
      RAISE WARNING 'Erro ao criar perfil para usuário %: %', NEW.id, SQLERRM;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar novo trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Garantir que a tabela user_profiles existe com estrutura correta
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname text UNIQUE NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Garantir RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Recriar políticas de segurança
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON user_profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON user_profiles;
DROP POLICY IF EXISTS "Usuários podem inserir seu próprio perfil" ON user_profiles;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();