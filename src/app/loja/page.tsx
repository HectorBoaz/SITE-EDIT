'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { generatePixCopyPaste, validatePixCode } from '@/lib/pix'

type PlanType = 'cosmo' | 'astral' | 'legacy'

interface Plan {
  name: string
  price: number
  features: string[]
  popular?: boolean
}

interface User {
  id: string
  email: string
  user_metadata: {
    nickname?: string
  }
}

const plans: Record<PlanType, Plan> = {
  cosmo: {
    name: 'VIP Cosmo',
    price: 29.90,
    features: [
      'Acesso a kits exclusivos',
      'Prefix [Cosmo] no chat',
      '2x XP em todos os jogos',
      'Acesso a lobbies VIP',
      'Cores no chat',
      '5 homes extras'
    ]
  },
  astral: {
    name: 'VIP Astral',
    price: 49.90,
    popular: true,
    features: [
      'Todos os benefícios do Cosmo',
      'Prefix [Astral] no chat',
      '3x XP em todos os jogos',
      'Kits premium exclusivos',
      'Fly no lobby',
      '10 homes extras',
      'Acesso a eventos especiais'
    ]
  },
  legacy: {
    name: 'VIP Legacy',
    price: 79.90,
    features: [
      'Todos os benefícios do Astral',
      'Prefix [Legacy] no chat',
      '5x XP em todos os jogos',
      'Kits lendários exclusivos',
      'Acesso total a comandos',
      '20 homes extras',
      'Suporte prioritário',
      'Participação em beta tests'
    ]
  }
}

export default function ShopPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'danger' } | null>(null)

  useEffect(() => {
    checkUser()
    checkUrlParams()
  }, [])

  const checkUrlParams = () => {
    const params = new URLSearchParams(window.location.search)
    const message = params.get('message')
    const error = params.get('error')

    if (message === 'cancelled') {
      showMessage('Compra cancelada com sucesso.', 'success')
      // Limpar parâmetro da URL
      window.history.replaceState({}, '', '/loja')
    } else if (error === 'expired') {
      showMessage('O pagamento expirou. Por favor, tente novamente.', 'danger')
      window.history.replaceState({}, '', '/loja')
    } else if (error === 'notfound') {
      showMessage('Compra não encontrada.', 'danger')
      window.history.replaceState({}, '', '/loja')
    }
  }

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    } catch (error) {
      console.error('Erro ao verificar usuário:', error)
    }
  }

  const showMessage = (text: string, type: 'success' | 'danger' = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 5000)
  }

  const generatePixCode = (amount: number, description: string): string => {
    try {
      // Gerar código PIX real usando a chave do PicPay
      const pixCode = generatePixCopyPaste(amount, description)
      
      // Validar o código gerado
      if (!validatePixCode(pixCode)) {
        throw new Error('Código PIX inválido')
      }
      
      console.log('PIX gerado com sucesso para:', description, 'Valor:', amount)
      return pixCode
    } catch (error) {
      console.error('Erro ao gerar PIX:', error)
      // Fallback para código simples em caso de erro
      return `00020126580014br.gov.bcb.pix0136${Math.random().toString(36).substr(2, 9).toUpperCase()}520400005303986540${amount.toFixed(2)}5802BR5913Astral Legacy6009BRASILIA62070503***6304`
    }
  }

  const handlePurchase = async (planType: PlanType) => {
    if (!user) {
      showMessage('Você deve fazer login para realizar a compra!', 'danger')
      setTimeout(() => {
        router.push('/auth')
      }, 2000)
      return
    }

    setLoading(true)
    
    try {
      console.log('Iniciando compra do plano:', planType)
      
      // Gerar código PIX
      const pixCode = generatePixCode(plans[planType].price, plans[planType].name)
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
      
      // Criar registro de compra
      const { data, error } = await supabase
        .from('purchases')
        .insert({
          user_id: user.id,
          plan_type: planType,
          amount: plans[planType].price,
          status: 'pending',
          payment_method: 'pix',
          pix_code: pixCode,
          pix_expires_at: expiresAt.toISOString()
        })
        .select()
        .single()

      if (error) throw error

      console.log('Compra criada:', data)
      
      showMessage(
        `Compra do ${plans[planType].name} criada! Redirecionando para pagamento...`,
        'success'
      )

      // Redirecionar para página de pagamento
      setTimeout(() => {
        router.push(`/pagamento/${data.id}`)
      }, 2000)

    } catch (error: any) {
      console.error('Erro na compra:', error)
      showMessage('Erro ao processar compra. Tente novamente.', 'danger')
    } finally {
      setLoading(false)
    }
  }

  const simulatePaymentSuccess = async (purchaseId: string, planType: PlanType) => {
    try {
      console.log('🔄 Atualizando status da compra...')
      
      // Atualizar status da compra para paga
      const { error: updateError } = await supabase
        .from('purchases')
        .update({ 
          status: 'completed'
        })
        .eq('id', purchaseId)

      if (updateError) {
        console.error('❌ Erro ao atualizar compra:', updateError)
        throw updateError
      }

      console.log('✅ Compra atualizada com sucesso')

      // Verificar se já existe uma assinatura ativa
      const { data: existingSubscription } = await supabase
        .from('vip_subscriptions')
        .select('*')
        .eq('user_id', user!.id)
        .eq('status', 'active')
        .single()

      if (existingSubscription) {
        console.log('🔄 Atualizando assinatura existente...')
        
        // Atualizar assinatura existente
        const { error: updateSubError } = await supabase
          .from('vip_subscriptions')
          .update({
            plan_type: planType,
            price: plans[planType].price,
            status: 'active',
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 dias
          })
          .eq('id', existingSubscription.id)

        if (updateSubError) {
          console.error('❌ Erro ao atualizar assinatura:', updateSubError)
          throw updateSubError
        }
      } else {
        console.log('🆕 Criando nova assinatura...')
        
        // Criar nova assinatura VIP
        const { error: subscriptionError } = await supabase
          .from('vip_subscriptions')
          .insert({
            user_id: user!.id,
            plan_type: planType,
            price: plans[planType].price,
            status: 'active',
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 dias
          })

        if (subscriptionError) {
          console.error('❌ Erro ao criar assinatura:', subscriptionError)
          throw subscriptionError
        }
      }

      console.log('✅ VIP ativado com sucesso!')

      showMessage(
        `🎉 Parabéns! Seu ${plans[planType].name} foi ativado com sucesso!`,
        'success'
      )

      // Redirecionar para dashboard após 3 segundos
      setTimeout(() => {
        router.push('/dashboard')
      }, 3000)

    } catch (error: any) {
      console.error('❌ Erro detalhado ao ativar VIP:', error)
      showMessage(`Erro ao ativar VIP: ${error.message}`, 'danger')
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
          <div className="row justify-content-center align-items-center">
            <div className="col-12 col-md-6 text-center mb-4 mb-md-0">
              <Image 
                src="/images/512xnewhypixel.png" 
                alt="Astral Legacy" 
                width={250} 
                height={250}
              />
            </div>
            <div className="col-12 col-md-6">
              <h1 className="display-1 fw-bold mb-3">Loja VIP</h1>
              <p className="fs-5 mb-4">
                Adquira seu VIP e tenha acesso a benefícios exclusivos no servidor Astral Legacy!
              </p>
              <a href="#planos" className="btn btn-primary btn-lg">
                Ver Planos
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="planos" className="py-5" style={{ backgroundColor: '#1a1a2e' }}>
        <div className="container py-5">
          <div className="row justify-content-center mb-5">
            <div className="col-md-12 col-lg-10 text-center">
              <h2 className="display-2 fw-bold mb-3">Planos VIP</h2>
              <h4 className="fs-4 text-white-50">
                Escolha o plano que melhor se adequa ao seu estilo de jogo
              </h4>
            </div>
          </div>

          <div className="row g-4">
            {Object.entries(plans).map(([key, plan]) => (
              <div key={key} className="col-12 col-md-6 col-lg-4">
                <div className={`card h-100 position-relative ${plan.popular ? 'border-primary border-3' : ''}`}>
                  {plan.popular && (
                    <div className="position-absolute top-0 start-50 translate-middle">
                      <span className="badge bg-danger px-3 py-2">MAIS POPULAR</span>
                    </div>
                  )}
                  
                  <div 
                    className="text-white text-center py-4"
                    style={{ 
                      background: plan.popular 
                        ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }}
                  >
                    <h3 className="fw-bold mb-3">{plan.name}</h3>
                    <div>
                      <span className="display-3 fw-bold">R$ {plan.price.toFixed(2)}</span>
                      <span className="fs-5">/mês</span>
                    </div>
                  </div>
                  
                  <div className="card-body p-4">
                    <ul className="list-unstyled mb-4">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="mb-2 text-dark">
                          <span className="text-success me-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="text-center">
                      {user ? (
                        <button 
                          onClick={() => handlePurchase(key as PlanType)}
                          disabled={loading}
                          className={`btn btn-lg w-100 ${plan.popular ? 'btn-success' : 'btn-primary'}`}
                        >
                          {loading ? 'Processando...' : 'Comprar Agora'}
                        </button>
                      ) : (
                        <button 
                          onClick={() => handlePurchase(key as PlanType)}
                          className={`btn btn-lg w-100 ${plan.popular ? 'btn-success' : 'btn-primary'}`}
                        >
                          Fazer Login para Comprar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Info Section */}
      <section className="py-5" style={{ backgroundColor: 'rgba(0, 123, 255, 0.1)' }}>
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-10 col-lg-8 text-center">
              <h2 className="display-3 fw-bold mb-4">Informações de Pagamento</h2>
              
              <h4 className="fs-4 fw-bold mb-3">Formas de Pagamento Aceitas</h4>
              <p className="fs-5 mb-4">
                💳 Cartão de Crédito (Visa, Mastercard, Elo)<br />
                💰 PIX (Aprovação instantânea)<br />
                🏦 Boleto Bancário<br />
                💻 PayPal
              </p>
              
              <h4 className="fs-4 fw-bold mb-3">Política de Reembolso</h4>
              <p className="fs-6 text-white-50">
                Oferecemos reembolso total em até 7 dias após a compra, desde que não tenha havido uso dos benefícios VIP. 
                Para solicitar reembolso, entre em contato com nosso suporte através do Discord ou e-mail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Messages */}
      {message && (
        <div className="position-fixed top-0 start-50 translate-middle-x mt-5" style={{ zIndex: 9999 }}>
          <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
            {message.text}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setMessage(null)}
            ></button>
          </div>
        </div>
      )}
    </>
  )
}

