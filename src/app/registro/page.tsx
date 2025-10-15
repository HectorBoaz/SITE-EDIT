'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, FormEvent } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'danger' } | null>(null)

  const showMessage = (text: string, type: 'success' | 'danger' = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 5000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Validações
    if (formData.password !== formData.confirmPassword) {
      showMessage('As senhas não coincidem!', 'danger')
      return
    }

    if (formData.password.length < 6) {
      showMessage('A senha deve ter pelo menos 6 caracteres!', 'danger')
      return
    }

    if (!formData.nickname.trim()) {
      showMessage('Por favor, informe seu nickname!', 'danger')
      return
    }

    setLoading(true)

    try {
      console.log('Iniciando cadastro...')
      console.log('Dados do formulário:', { 
        email: formData.email, 
        nickname: formData.nickname,
        hasPassword: !!formData.password 
      })
      
      // Criar usuário no Auth com metadados
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nickname: formData.nickname,
            phone: formData.phone
          },
          emailRedirectTo: undefined // Desabilitar redirecionamento
        }
      })

      console.log('Resposta completa do Supabase:', { data, error })

      if (error) {
        console.error('Erro do Supabase:', error)
        throw error
      }

      // Verificar se o usuário foi criado
      if (data.user) {
        console.log('Usuário criado com sucesso:', data.user.id)
        
        // Verificar se precisa confirmar email
        if (data.user.email_confirmed_at) {
          showMessage(
            'Conta criada com sucesso! Você já pode fazer login.',
            'success'
          )
          
          // Redirecionar para login imediatamente
          setTimeout(() => {
            router.push('/auth')
          }, 2000)
        } else {
          showMessage(
            'Conta criada com sucesso! Verifique seu email para confirmar o cadastro.',
            'success'
          )
          
          // Redirecionar para login após 3 segundos
          setTimeout(() => {
            router.push('/auth')
          }, 3000)
        }
        
        // Limpar formulário
        setFormData({
          nickname: '',
          email: '',
          password: '',
          confirmPassword: '',
          phone: ''
        })
      } else {
        console.error('Nenhum usuário retornado na resposta')
        showMessage('Erro inesperado ao criar usuário. Tente novamente.', 'danger')
      }

    } catch (err: any) {
      console.error('Erro detalhado no catch:', err)
      
      let errorMessage = 'Erro no cadastro: '
      
      if (err.message?.includes('already registered') || 
          err.message?.includes('User already registered') ||
          err.message?.includes('already been registered')) {
        errorMessage = 'Este e-mail já está cadastrado!'
      } else if (err.message?.includes('Invalid email')) {
        errorMessage = 'E-mail inválido!'
      } else if (err.message?.includes('Password')) {
        errorMessage = 'Senha deve ter pelo menos 6 caracteres!'
      } else if (err.message?.includes('Database error')) {
        errorMessage = 'Erro no servidor. Tente novamente em alguns minutos.'
      } else if (err.message?.includes('signup is disabled')) {
        errorMessage = 'Cadastro temporariamente desabilitado. Entre em contato com o suporte.'
      } else if (err.message?.includes('rate limit')) {
        errorMessage = 'Muitas tentativas. Aguarde alguns minutos e tente novamente.'
      } else {
        errorMessage += err.message || 'Erro desconhecido'
      }
      
      showMessage(errorMessage, 'danger')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section 
        className="parallax-section min-vh-100 d-flex align-items-center" 
        style={{ 
          backgroundImage: 'url(/images/wallpaperwebsite2.jpg)',
          marginTop: '56px'
        }}
      >
        <div className="container">
          <div className="row justify-content-center align-items-center mb-5">
            <div className="col-12 col-md-6 text-center mb-4 mb-md-0">
              <Image 
                src="/images/512xnewhypixel.png" 
                alt="Astral Legacy" 
                width={250} 
                height={250}
              />
            </div>
            <div className="col-12 col-md-6">
              <h1 className="display-1 fw-bold mb-3">Criar Conta</h1>
              <p className="fs-5">
                Registre-se para acessar benefícios exclusivos do Astral Legacy!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Register Form Section */}
      <section className="py-5" style={{ backgroundColor: '#1a1a2e' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card">
                <div className="card-body p-4">
                  <h3 className="text-center mb-4 display-2 fw-bold text-dark">Registrar</h3>
                  
                  {message && (
                    <div className={`alert alert-${message.type} animate-fade-in`} role="alert">
                      {message.text}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="nickname" className="form-label text-dark fw-bold">
                        Nickname no Servidor *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="nickname"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        placeholder="SeuNickname"
                      />
                      <small className="text-muted">Este será seu nome no servidor</small>
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label text-dark fw-bold">Email *</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        placeholder="seu@email.com"
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label text-dark fw-bold">Senha *</label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        minLength={6}
                        placeholder="Mínimo 6 caracteres"
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="confirmPassword" className="form-label text-dark fw-bold">
                        Confirmar Senha *
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        placeholder="Digite a senha novamente"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="phone" className="form-label text-dark fw-bold">
                        Número de Celular <span className="text-muted">(opcional)</span>
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                    
                    <div className="text-center">
                      <button 
                        type="submit" 
                        className="btn btn-primary btn-lg w-100 mb-3"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Registrando...
                          </>
                        ) : (
                          'Criar Conta'
                        )}
                      </button>
                    </div>
                  </form>
                  
                  <div className="text-center">
                    <p className="text-dark">
                      Já tem uma conta? <Link href="/auth" className="text-primary fw-bold">Entre aqui</Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
