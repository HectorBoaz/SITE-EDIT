'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import QRCode from 'qrcode'
import PixInfo from '@/components/PixInfo'

interface Purchase {
  id: string
  user_id: string
  plan_type: 'cosmo' | 'astral' | 'legacy'
  amount: number
  status: 'pending' | 'completed' | 'cancelled'
  payment_method: string
  pix_code?: string
  pix_expires_at?: string
  created_at: string
}

interface Plan {
  name: string
  price: number
}

const plans: Record<string, Plan> = {
  cosmo: { name: 'VIP Cosmo', price: 29.90 },
  astral: { name: 'VIP Astral', price: 49.90 },
  legacy: { name: 'VIP Legacy', price: 79.90 }
}

export default function PagamentoPage() {
  const params = useParams()
  const router = useRouter()
  const purchaseId = params.id as string
  
  const [purchase, setPurchase] = useState<Purchase | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (purchaseId) {
      loadPurchase()
    }
  }, [purchaseId])

  useEffect(() => {
    if (purchase?.pix_expires_at) {
      const interval = setInterval(() => {
        const now = new Date().getTime()
        const expiry = new Date(purchase.pix_expires_at!).getTime()
        const remaining = Math.max(0, expiry - now)
        
        setTimeLeft(remaining)
        
        if (remaining === 0) {
          // Tempo esgotado, redirecionar
          router.push('/loja?error=expired')
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [purchase])

  // Verificação automática de pagamento a cada 10 segundos
  useEffect(() => {
    if (purchase?.status === 'pending') {
      const paymentCheckInterval = setInterval(() => {
        checkPayment()
      }, 10000) // 10 segundos

      return () => clearInterval(paymentCheckInterval)
    }
  }, [purchase])

  const loadPurchase = async () => {
    try {
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .eq('id', purchaseId)
        .single()

      if (error) throw error

      setPurchase(data)

      // Gerar QR Code se ainda não existe
      if (data.pix_code && !qrCodeUrl) {
        generateQRCode(data.pix_code)
      }

      // Verificar se já foi pago
      if (data.status === 'completed') {
        router.push('/dashboard?success=purchased')
      }

    } catch (error) {
      console.error('Erro ao carregar compra:', error)
      router.push('/loja?error=notfound')
    } finally {
      setLoading(false)
    }
  }

  const checkPayment = async () => {
    if (!purchaseId) return

    try {
      const response = await fetch('/api/check-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ purchaseId }),
      })

      const result = await response.json()

      if (result.status === 'completed') {
        router.push('/dashboard?success=purchased')
      } else if (result.status === 'expired') {
        router.push('/loja?error=expired')
      } else {
        // Recarregar dados da compra
        await loadPurchase()
      }
    } catch (error) {
      console.error('Erro ao verificar pagamento:', error)
    }
  }

  const cancelPurchase = async () => {
    if (!purchaseId) return

    // Confirmar cancelamento
    const confirmed = window.confirm(
      'Tem certeza que deseja cancelar esta compra? Esta ação não pode ser desfeita.'
    )

    if (!confirmed) return

    try {
      setLoading(true)

      // Deletar a compra do banco de dados
      const { error } = await supabase
        .from('purchases')
        .delete()
        .eq('id', purchaseId)

      if (error) throw error

      // Redirecionar para loja com mensagem de cancelamento
      router.push('/loja?message=cancelled')
    } catch (error) {
      console.error('Erro ao cancelar compra:', error)
      alert('Erro ao cancelar compra. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const generateQRCode = async (pixCode: string) => {
    try {
      const qrCode = await QRCode.toDataURL(pixCode, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      setQrCodeUrl(qrCode)
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error)
    }
  }

  const copyPixCode = async () => {
    if (purchase?.pix_code) {
      try {
        await navigator.clipboard.writeText(purchase.pix_code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        console.error('Erro ao copiar:', error)
      }
    }
  }

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((ms % (1000 * 60)) / 1000)
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="container py-5" style={{ marginTop: '80px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-3">Carregando dados do pagamento...</p>
        </div>
      </div>
    )
  }

  if (!purchase) {
    return (
      <div className="container py-5" style={{ marginTop: '80px' }}>
        <div className="alert alert-danger">
          <h4>Compra não encontrada</h4>
          <p>Esta compra não existe ou foi removida.</p>
          <a href="/loja" className="btn btn-primary">Voltar para Loja</a>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5" style={{ marginTop: '80px' }}>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card">
            <div className="card-header bg-primary text-white text-center">
              <h3 className="mb-0">💳 Pagamento PIX</h3>
            </div>
            
            <div className="card-body">
              {/* Informações do PIX */}
              <PixInfo 
                amount={purchase.amount} 
                planName={plans[purchase.plan_type]?.name || ''} 
              />

              {/* Status da Compra */}
              <div className="text-center mb-4">
                <span className={`badge ${purchase.status === 'pending' ? 'bg-warning' : 'bg-success'}`}>
                  {purchase.status === 'pending' ? 'AGUARDANDO PAGAMENTO' : 'PAGO'}
                </span>
              </div>

              {/* Contador */}
              {purchase.status === 'pending' && purchase.pix_expires_at && (
                <div className="alert alert-warning text-center">
                  <h5>⏰ Tempo restante:</h5>
                  <h2 className="text-danger">{formatTime(timeLeft)}</h2>
                  <small>Após este tempo, o pagamento será cancelado automaticamente</small>
                </div>
              )}

              {/* QR Code */}
              {purchase.pix_code && qrCodeUrl && (
                <div className="text-center mb-4">
                  <h5>📱 Escaneie o QR Code:</h5>
                  <div className="d-flex justify-content-center">
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code PIX" 
                      className="img-fluid border rounded"
                      style={{ maxWidth: '250px' }}
                    />
                  </div>
                </div>
              )}

              {/* Código PIX */}
              {purchase.pix_code && (
                <div className="mb-4">
                  <h5>📋 Código PIX:</h5>
                  <div className="input-group">
                    <input 
                      type="text" 
                      className="form-control" 
                      value={purchase.pix_code}
                      readOnly
                    />
                    <button 
                      className={`btn ${copied ? 'btn-success' : 'btn-outline-primary'}`}
                      onClick={copyPixCode}
                    >
                      {copied ? '✓ Copiado!' : '📋 Copiar'}
                    </button>
                  </div>
                </div>
              )}

              {/* Informações do PicPay */}
              <div className="alert alert-success">
                <h6>🏦 Pagamento via PicPay</h6>
                <p className="mb-2">
                  <strong>Chave PIX:</strong> <code>3e2c6f86-3e5a-4abe-9200-894843d02454</code>
                </p>
                <p className="mb-0">
                  <strong>Beneficiário:</strong> Astral Legacy
                </p>
              </div>

              {/* Instruções */}
              <div className="alert alert-info">
                <h6>📝 Instruções:</h6>
                <ol className="mb-0">
                  <li>Abra o app do seu banco ou PicPay</li>
                  <li>Escaneie o QR Code ou cole o código PIX</li>
                  <li>Confirme o valor: <strong>{formatCurrency(purchase.amount)}</strong></li>
                  <li>Verifique se o beneficiário é <strong>Astral Legacy</strong></li>
                  <li>Finalize o pagamento</li>
                  <li>Aguarde a confirmação automática</li>
                </ol>
              </div>

              {/* Botões */}
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-success"
                  onClick={checkPayment}
                  disabled={loading}
                >
                  🔄 Verificar Pagamento
                </button>
                <a href="/dashboard" className="btn btn-secondary">
                  📊 Meu Dashboard
                </a>
                <a href="/loja" className="btn btn-outline-primary">
                  🛒 Voltar para Loja
                </a>
                
                {/* Botão de Cancelamento */}
                {purchase.status === 'pending' && (
                  <div className="mt-3 pt-3 border-top">
                    <button 
                      className="btn btn-danger w-100"
                      onClick={cancelPurchase}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Cancelando...
                        </>
                      ) : (
                        <>❌ Cancelar Compra</>
                      )}
                    </button>
                    <small className="text-muted d-block text-center mt-2">
                      Se desistir da compra, o pagamento será cancelado
                    </small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
