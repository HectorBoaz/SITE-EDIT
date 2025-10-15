'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface UserProfile {
  id: string
  nickname: string
  phone?: string
  avatar_url?: string
  created_at: string
}

interface VipSubscription {
  id: string
  plan_type: 'cosmo' | 'astral' | 'legacy'
  status: 'active' | 'cancelled' | 'expired' | 'pending'
  start_date: string
  end_date: string
}

interface Purchase {
  id: string
  plan_type: 'cosmo' | 'astral' | 'legacy'
  amount: number
  status: 'pending' | 'completed' | 'cancelled'
  created_at: string
  completed_at?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [vipSubscription, setVipSubscription] = useState<VipSubscription | null>(null)
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      // Verificar se usuário está logado
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        router.push('/auth')
        return
      }

      setUser(user)

      // Carregar perfil do usuário
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) {
        console.error('Erro ao carregar perfil:', profileError)
      } else {
        setProfile(profileData)
      }

      // Carregar assinatura VIP ativa
      const { data: vipData, error: vipError } = await supabase
        .from('vip_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('end_date', { ascending: false })
        .limit(1)
        .single()

      if (vipError && vipError.code !== 'PGRST116') {
        console.error('Erro ao carregar VIP:', vipError)
      } else if (vipData) {
        setVipSubscription(vipData)
      }

      // Carregar histórico de compras
      const { data: purchasesData, error: purchasesError } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (purchasesError) {
        console.error('Erro ao carregar compras:', purchasesError)
      } else {
        setPurchases(purchasesData || [])
      }

    } catch (error) {
      console.error('Erro geral:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const getPlanName = (planType: string) => {
    const names = {
      cosmo: 'VIP Cosmo',
      astral: 'VIP Astral',
      legacy: 'VIP Legacy'
    }
    return names[planType as keyof typeof names] || planType
  }

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'success',
      pending: 'warning',
      completed: 'success',
      cancelled: 'danger',
      expired: 'secondary'
    }
    return colors[status as keyof typeof colors] || 'secondary'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
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
          <p className="mt-3">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5" style={{ marginTop: '80px' }}>
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="display-4 fw-bold">Dashboard</h1>
            <button onClick={handleLogout} className="btn btn-outline-danger">
              Sair
            </button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Perfil do Usuário */}
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card h-100">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">👤 Meu Perfil</h5>
            </div>
            <div className="card-body">
              {profile ? (
                <>
                  <h6 className="fw-bold">Nickname:</h6>
                  <p className="text-primary fs-5">{profile.nickname}</p>
                  
                  <h6 className="fw-bold">Email:</h6>
                  <p>{user.email}</p>
                  
                  {profile.phone && (
                    <>
                      <h6 className="fw-bold">Telefone:</h6>
                      <p>{profile.phone}</p>
                    </>
                  )}
                  
                  <h6 className="fw-bold">Membro desde:</h6>
                  <p>{formatDate(profile.created_at)}</p>
                </>
              ) : (
                <p>Carregando perfil...</p>
              )}
            </div>
          </div>
        </div>

        {/* Status VIP */}
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card h-100">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">⭐ Status VIP</h5>
            </div>
            <div className="card-body">
              {vipSubscription ? (
                <>
                  <h6 className="fw-bold">Plano Ativo:</h6>
                  <p className="text-success fs-5">{getPlanName(vipSubscription.plan_type)}</p>
                  
                  <h6 className="fw-bold">Status:</h6>
                  <span className={`badge bg-${getStatusColor(vipSubscription.status)}`}>
                    {vipSubscription.status.toUpperCase()}
                  </span>
                  
                  <h6 className="fw-bold mt-3">Expira em:</h6>
                  <p>{formatDate(vipSubscription.end_date)}</p>
                  
                  <div className="mt-3">
                    <a href="/loja" className="btn btn-primary btn-sm">
                      Renovar VIP
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-muted">Você não possui VIP ativo</p>
                  <a href="/loja" className="btn btn-success">
                    Comprar VIP
                  </a>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card h-100">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">📊 Estatísticas</h5>
            </div>
            <div className="card-body">
              <h6 className="fw-bold">Total de Compras:</h6>
              <p className="fs-4">{purchases.length}</p>
              
              <h6 className="fw-bold">Valor Total Gasto:</h6>
              <p className="fs-4 text-success">
                {formatCurrency(purchases.reduce((sum, purchase) => sum + purchase.amount, 0))}
              </p>
              
              <h6 className="fw-bold">Compras Concluídas:</h6>
              <p className="fs-4 text-success">
                {purchases.filter(p => p.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Histórico de Compras */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">🛒 Histórico de Compras</h5>
            </div>
            <div className="card-body">
              {purchases.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Plano</th>
                        <th>Valor</th>
                        <th>Status</th>
                        <th>Data da Compra</th>
                        <th>Data de Conclusão</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchases.map((purchase) => (
                        <tr key={purchase.id}>
                          <td>{getPlanName(purchase.plan_type)}</td>
                          <td>{formatCurrency(purchase.amount)}</td>
                          <td>
                            <span className={`badge bg-${getStatusColor(purchase.status)}`}>
                              {purchase.status.toUpperCase()}
                            </span>
                          </td>
                          <td>{formatDate(purchase.created_at)}</td>
                          <td>
                            {purchase.completed_at ? formatDate(purchase.completed_at) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted text-center py-4">
                  Nenhuma compra realizada ainda.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
