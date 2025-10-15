import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { purchaseId } = await request.json()

    if (!purchaseId) {
      return NextResponse.json({ error: 'Purchase ID is required' }, { status: 400 })
    }

    // Buscar a compra
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .select('*')
      .eq('id', purchaseId)
      .single()

    if (purchaseError || !purchase) {
      return NextResponse.json({ error: 'Purchase not found' }, { status: 404 })
    }

    // Verificar se expirou
    if (purchase.pix_expires_at && new Date(purchase.pix_expires_at) < new Date()) {
      // Atualizar status para cancelado
      await supabase
        .from('purchases')
        .update({ status: 'cancelled' })
        .eq('id', purchaseId)

      return NextResponse.json({ 
        status: 'expired',
        message: 'Payment expired' 
      })
    }

    // Simular verificação de pagamento (em produção, integrar com gateway)
    // Por enquanto, vamos simular que o pagamento foi aprovado após 30 segundos
    const timeSinceCreated = Date.now() - new Date(purchase.created_at).getTime()
    const isPaid = timeSinceCreated > 30000 // 30 segundos para teste

    if (isPaid && purchase.status === 'pending') {
      // Atualizar status da compra
      const { error: updateError } = await supabase
        .from('purchases')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', purchaseId)

      if (updateError) throw updateError

      // Criar/atualizar assinatura VIP
      const { error: subscriptionError } = await supabase
        .from('vip_subscriptions')
        .upsert({
          user_id: purchase.user_id,
          plan_type: purchase.plan_type,
          price: purchase.amount,
          status: 'active',
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 dias
        })

      if (subscriptionError) throw subscriptionError

      return NextResponse.json({ 
        status: 'completed',
        message: 'Payment confirmed and VIP activated!' 
      })
    }

    return NextResponse.json({ 
      status: purchase.status,
      message: 'Payment still pending' 
    })

  } catch (error: any) {
    console.error('Error checking payment:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}
