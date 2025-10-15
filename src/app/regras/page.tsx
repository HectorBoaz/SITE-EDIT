import Image from 'next/image'

export default function RulesPage() {
  const rules = [
    {
      title: 'Respeito Mútuo',
      description: 'Trate todos os jogadores com respeito. Não toleramos discriminação, assédio ou comportamento ofensivo.'
    },
    {
      title: 'Sem Hacks ou Cheats',
      description: 'O uso de modificações não autorizadas, hacks, cheats ou qualquer software que dê vantagem injusta resultará em banimento permanente.'
    },
    {
      title: 'Sem Griefing',
      description: 'Não destrua ou modifique as construções de outros jogadores sem permissão. Respeite o trabalho alheio.'
    },
    {
      title: 'Chat Limpo',
      description: 'Evite spam, flood, caps lock excessivo ou linguagem inadequada no chat. Mantenha as conversas apropriadas para todas as idades.'
    },
    {
      title: 'Sem Exploits',
      description: 'Não abuse de bugs ou exploits do jogo. Reporte quaisquer problemas encontrados à equipe de moderação.'
    },
    {
      title: 'Contas Pessoais',
      description: 'Cada jogador deve usar apenas uma conta. Contas alternativas (alts) são permitidas apenas com autorização prévia da staff.'
    },
    {
      title: 'Publicidade',
      description: 'Não faça propaganda de outros servidores ou serviços não relacionados ao Astral Legacy.'
    },
    {
      title: 'Moderação',
      description: 'As decisões da equipe de moderação são finais. Se discordar, entre em contato via ticket no Discord.'
    }
  ]

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
              <h1 className="display-1 fw-bold mb-3">Regras do Servidor</h1>
              <p className="fs-5">
                Para manter uma comunidade saudável e divertida para todos, pedimos que siga estas regras.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rules Section */}
      <section className="py-5" style={{ backgroundColor: '#1a1a2e' }}>
        <div className="container py-5">
          <div className="row justify-content-center mb-5">
            <div className="col-md-10 col-lg-8 text-center">
              <h2 className="display-2 fw-bold mb-3">Normas de Conduta</h2>
              <p className="fs-5 text-white-50">
                Leia atentamente as regras antes de jogar. O descumprimento pode resultar em advertência, suspensão ou banimento.
              </p>
            </div>
          </div>

          <div className="row g-4">
            {rules.map((rule, index) => (
              <div key={index} className="col-12 col-md-6">
                <div className="card h-100">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-start">
                      <div 
                        className="me-3 fw-bold text-white rounded-circle d-flex align-items-center justify-content-center"
                        style={{ 
                          minWidth: '40px', 
                          height: '40px', 
                          backgroundColor: '#007bff' 
                        }}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="card-title text-dark mb-2">{rule.title}</h3>
                        <p className="card-text text-secondary mb-0">{rule.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row justify-content-center mt-5">
            <div className="col-md-10 col-lg-8">
              <div className="card bg-warning">
                <div className="card-body p-4 text-center">
                  <h3 className="fw-bold mb-3">⚠️ Importante</h3>
                  <p className="mb-0">
                    A equipe do Astral Legacy se reserva o direito de modificar estas regras a qualquer momento. 
                    É responsabilidade do jogador manter-se atualizado sobre as regras do servidor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Punishments Section */}
      <section className="py-5" style={{ backgroundColor: 'rgba(0, 123, 255, 0.1)' }}>
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-10 col-lg-8">
              <h2 className="display-3 fw-bold text-center mb-5">Sistema de Punições</h2>
              
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="text-center">
                    <div className="mb-3" style={{ fontSize: '48px' }}>⚠️</div>
                    <h4 className="fw-bold mb-2">Advertência</h4>
                    <p className="text-white-50">Primeira infração leve</p>
                  </div>
                </div>
                
                <div className="col-md-4">
                  <div className="text-center">
                    <div className="mb-3" style={{ fontSize: '48px' }}>⏸️</div>
                    <h4 className="fw-bold mb-2">Suspensão</h4>
                    <p className="text-white-50">Infrações repetidas ou médias</p>
                  </div>
                </div>
                
                <div className="col-md-4">
                  <div className="text-center">
                    <div className="mb-3" style={{ fontSize: '48px' }}>🚫</div>
                    <h4 className="fw-bold mb-2">Banimento</h4>
                    <p className="text-white-50">Infrações graves ou reincidência</p>
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

