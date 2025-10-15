'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, FormEvent } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'danger' } | null>(null)

  const showMessage = (text: string, type: 'success' | 'danger' = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 5000)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('Tentando fazer login...')
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      console.log('Resposta do login:', { data, error })
      
      if (error) throw error
      
      showMessage('Login realizado com sucesso! Redirecionando...', 'success')
      
      // Redirecionar após 1 segundo
      setTimeout(() => {
        router.push('/')
        router.refresh()
      }, 1000)
      
    } catch (error: any) {
      console.error('Erro no login:', error)
      
      let errorMessage = 'Erro no login: '
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Email ou senha incorretos!'
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Confirme seu email antes de fazer login!'
      } else {
        errorMessage += error.message
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
              <h1 className="display-1 fw-bold mb-3">Entrar na Conta</h1>
              <p className="fs-5">
                Faça login para acessar benefícios exclusivos do Astral Legacy!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Login Form Section */}
      <section className="py-5" style={{ backgroundColor: '#1a1a2e' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card">
                <div className="card-body p-4">
                  <h3 className="text-center mb-4 display-2 fw-bold text-dark">Entrar</h3>
                  
                  {message && (
                    <div className={`alert alert-${message.type} animate-fade-in`} role="alert">
                      {message.text}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label text-dark fw-bold">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        placeholder="seu@email.com"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="password" className="form-label text-dark fw-bold">Senha</label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                        placeholder="••••••••"
                        minLength={6}
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
                            Entrando...
                          </>
                        ) : (
                          'Entrar'
                        )}
                      </button>
                    </div>
                  </form>
                  
                  <div className="text-center">
                    <p className="text-dark mb-2">
                      Não tem uma conta? <Link href="/registro" className="text-primary fw-bold">Registre-se aqui</Link>
                    </p>
                    <p className="text-muted small">
                      Esqueceu a senha? <a href="#" className="text-primary">Recuperar senha</a>
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
