import { createClient } from '@supabase/supabase-js'

// Variáveis de ambiente do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Debug: mostrar variáveis no console
console.log('🔍 Debug Supabase:')
console.log('URL:', supabaseUrl ? '✅ Definida' : '❌ Não definida')
console.log('Key:', supabaseAnonKey ? '✅ Definida' : '❌ Não definida')

// Verificar se as variáveis estão definidas
if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL não está definida')
  throw new Error('NEXT_PUBLIC_SUPABASE_URL não está definida no arquivo .env.local')
}

if (!supabaseAnonKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY não está definida')
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY não está definida no arquivo .env.local')
}

// Criar cliente do Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('✅ Cliente Supabase criado com sucesso!')

// Tipos para o banco de dados
export interface UserProfile {
  id: string
  nickname: string
  phone?: string
  created_at?: string
  updated_at?: string
}

export interface AuthUser {
  id: string
  email: string
  user_metadata?: {
    nickname?: string
    phone?: string
  }
}

