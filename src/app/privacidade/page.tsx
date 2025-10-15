export default function PrivacyPage() {
  return (
    <div className="container py-5" style={{ marginTop: '80px', minHeight: '60vh' }}>
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <h1 className="display-2 fw-bold mb-4">Política de Privacidade</h1>
          
          <div className="card mb-4">
            <div className="card-body p-4">
              <h2 className="h4 text-dark mb-3">1. Coleta de Dados</h2>
              <p className="text-dark">
                Coletamos apenas as informações necessárias para o funcionamento do servidor, incluindo:
                nickname, email, e número de telefone (opcional).
              </p>

              <h2 className="h4 text-dark mb-3 mt-4">2. Uso de Dados</h2>
              <p className="text-dark">
                Seus dados são utilizados exclusivamente para:
              </p>
              <ul className="text-dark">
                <li>Gerenciamento de conta</li>
                <li>Comunicação sobre o servidor</li>
                <li>Processamento de pagamentos VIP</li>
                <li>Suporte técnico</li>
              </ul>

              <h2 className="h4 text-dark mb-3 mt-4">3. Proteção de Dados</h2>
              <p className="text-dark">
                Implementamos medidas de segurança para proteger suas informações pessoais contra acesso não autorizado.
              </p>

              <h2 className="h4 text-dark mb-3 mt-4">4. Compartilhamento</h2>
              <p className="text-dark">
                Não compartilhamos, vendemos ou alugamos suas informações pessoais a terceiros.
              </p>

              <h2 className="h4 text-dark mb-3 mt-4">5. Cookies</h2>
              <p className="text-dark">
                Utilizamos cookies para melhorar a experiência do usuário em nosso site.
              </p>

              <h2 className="h4 text-dark mb-3 mt-4">6. Seus Direitos</h2>
              <p className="text-dark">
                Você tem o direito de acessar, corrigir ou excluir seus dados pessoais a qualquer momento.
                Entre em contato conosco para exercer esses direitos.
              </p>

              <h2 className="h4 text-dark mb-3 mt-4">7. Contato</h2>
              <p className="text-dark">
                Para questões sobre privacidade, entre em contato: contato@astrallegacy.com
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

