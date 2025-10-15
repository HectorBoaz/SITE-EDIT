export default function TermsPage() {
  return (
    <div className="container py-5" style={{ marginTop: '80px', minHeight: '60vh' }}>
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <h1 className="display-2 fw-bold mb-4">Termos de Serviço</h1>
          
          <div className="card mb-4">
            <div className="card-body p-4">
              <h2 className="h4 text-dark mb-3">1. Aceitação dos Termos</h2>
              <p className="text-dark">
                Ao acessar e usar o servidor Astral Legacy, você concorda em cumprir estes Termos de Serviço.
              </p>

              <h2 className="h4 text-dark mb-3 mt-4">2. Elegibilidade</h2>
              <p className="text-dark">
                Você deve ter pelo menos 13 anos de idade para usar nossos serviços. 
                Menores de 18 anos devem ter permissão dos pais ou responsáveis.
              </p>

              <h2 className="h4 text-dark mb-3 mt-4">3. Conta de Usuário</h2>
              <p className="text-dark">
                Você é responsável por manter a confidencialidade de sua conta e senha. 
                Todas as atividades realizadas em sua conta são de sua responsabilidade.
              </p>

              <h2 className="h4 text-dark mb-3 mt-4">4. Conduta do Usuário</h2>
              <p className="text-dark">
                Você concorda em:
              </p>
              <ul className="text-dark">
                <li>Seguir todas as regras do servidor</li>
                <li>Não usar hacks, cheats ou exploits</li>
                <li>Tratar outros jogadores com respeito</li>
                <li>Não fazer spam ou propaganda</li>
                <li>Não tentar comprometer a segurança do servidor</li>
              </ul>

              <h2 className="h4 text-dark mb-3 mt-4">5. Compras e Pagamentos</h2>
              <p className="text-dark">
                Todas as compras de VIP são finais, exceto quando especificado na política de reembolso. 
                Os benefícios VIP são válidos apenas enquanto a assinatura estiver ativa.
              </p>

              <h2 className="h4 text-dark mb-3 mt-4">6. Suspensão e Banimento</h2>
              <p className="text-dark">
                Reservamo-nos o direito de suspender ou banir qualquer conta que viole estes termos, 
                sem reembolso de valores pagos.
              </p>

              <h2 className="h4 text-dark mb-3 mt-4">7. Propriedade Intelectual</h2>
              <p className="text-dark">
                Todo o conteúdo do Astral Legacy, incluindo textos, gráficos e logos, 
                são propriedade exclusiva do servidor.
              </p>

              <h2 className="h4 text-dark mb-3 mt-4">8. Isenção de Responsabilidade</h2>
              <p className="text-dark">
                O servidor é fornecido "como está". Não garantimos disponibilidade ininterrupta 
                ou livre de erros.
              </p>

              <h2 className="h4 text-dark mb-3 mt-4">9. Modificações</h2>
              <p className="text-dark">
                Podemos modificar estes termos a qualquer momento. Continuando a usar o servidor 
                após as mudanças, você aceita os novos termos.
              </p>

              <h2 className="h4 text-dark mb-3 mt-4">10. Contato</h2>
              <p className="text-dark">
                Para questões sobre estes termos, entre em contato: contato@astrallegacy.com
              </p>

              <p className="text-muted mt-4 mb-0">
                <small>Última atualização: Janeiro 2025</small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

