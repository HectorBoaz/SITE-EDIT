interface PixInfoProps {
  amount: number
  planName: string
}

export default function PixInfo({ amount, planName }: PixInfoProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  return (
    <div className="alert alert-primary">
      <h6>💳 Informações do Pagamento</h6>
      <div className="row">
        <div className="col-md-6">
          <p className="mb-1"><strong>Plano:</strong> {planName}</p>
          <p className="mb-1"><strong>Valor:</strong> {formatCurrency(amount)}</p>
        </div>
        <div className="col-md-6">
          <p className="mb-1"><strong>Método:</strong> PIX via PicPay</p>
          <p className="mb-1"><strong>Beneficiário:</strong> Astral Legacy</p>
        </div>
      </div>
      <div className="mt-2">
        <small className="text-muted">
          🔒 Pagamento 100% seguro via PicPay • Confirmação automática
        </small>
      </div>
    </div>
  )
}
