'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [vipStatus, setVipStatus] = useState<string | null>(null)

  useEffect(() => {
    checkUser()
    
    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user)
        checkVipStatus(session.user.id)
      } else {
        setUser(null)
        setVipStatus(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        checkVipStatus(user.id)
      }
    } catch (error) {
      console.error('Erro ao verificar usuário:', error)
    }
  }

  const checkVipStatus = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('vip_subscriptions')
        .select('plan_type, status, end_date')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('end_date', { ascending: false })
        .limit(1)
        .single()

      if (data) {
        const endDate = new Date(data.end_date)
        const now = new Date()
        if (endDate > now) {
          setVipStatus(data.plan_type)
        } else {
          setVipStatus(null)
        }
      } else {
        setVipStatus(null)
      }
    } catch (error) {
      setVipStatus(null)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setVipStatus(null)
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top" style={{ backgroundColor: 'rgba(1, 17, 26, 0.95)' }}>
      <div className="container-fluid">
        <Link href="/" className="navbar-brand d-flex align-items-center">
          <Image 
            src="/images/512xnewhypixel.png" 
            alt="Astral Legacy" 
            width={48} 
            height={48}
            className="me-2"
          />
          <span>Astral Legacy</span>
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={() => setIsOpen(!isOpen)}
          aria-controls="navbarNav"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link href="/#sobre" className="nav-link">
                O que é Astral Legacy
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/como-entrar" className="nav-link">
                Como entrar
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/regras" className="nav-link">
                Regras
              </Link>
            </li>
          </ul>
          
          <div className="d-flex gap-2 ms-lg-3 align-items-center">
            <Link href="/loja" className="btn btn-primary">
              🛒 Loja
            </Link>
            
            {user ? (
              <div className="dropdown">
                <button 
                  className="btn btn-success dropdown-toggle" 
                  type="button" 
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {vipStatus ? `⭐ ${vipStatus.toUpperCase()}` : '👤 Dashboard'}
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <Link href="/dashboard" className="dropdown-item">
                      📊 Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/loja" className="dropdown-item">
                      🛒 Loja VIP
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button onClick={handleLogout} className="dropdown-item text-danger">
                      🚪 Sair
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link href="/auth" className="btn btn-secondary">
                🔐 Entrar
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

