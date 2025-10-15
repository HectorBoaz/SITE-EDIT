import Image from 'next/image'

export default function ComoEntrarPage() {
  const steps = [
    {
      number: 1,
      title: 'Tenha o Minecraft',
      description: 'Você precisa ter o Minecraft Java Edition instalado em seu computador. Versões compatíveis: 1.19 ou superior.',
      icon: '🎮'
    },
    {
      number: 2,
      title: 'Crie sua Conta',
      description: 'Registre-se em nosso site para ter acesso aos benefícios exclusivos e poder comprar VIP.',
      icon: '👤'
    },
    {
      number: 3,
      title: 'Adicione o Servidor',
      description: 'No Minecraft, vá em "Multiplayer" e clique em "Add Server". Use o IP: play.astrallegacy.com',
      icon: '🌐'
    },
    {
      number: 4,
      title: 'Entre e Jogue!',
      description: 'Conecte-se ao servidor e comece sua aventura! Não se esqueça de ler as regras.',
      icon: '🚀'
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
                width={300} 
                height={300}
              />
            </div>
            <div className="col-12 col-md-6">
              <h1 className="display-1 fw-bold mb-3">Como Entrar</h1>
              <p className="fs-5">
                Siga estes passos simples para começar a jogar no Astral Legacy!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-5" style={{ backgroundColor: '#1a1a2e' }}>
        <div className="container py-5">
          <div className="row justify-content-center mb-5">
            <div className="col-md-10 col-lg-8 text-center">
              <h2 className="display-2 fw-bold mb-3">Passo a Passo</h2>
              <p className="fs-5 text-white-50">
                É rápido e fácil começar sua jornada no servidor
              </p>
            </div>
          </div>

          <div className="row g-4">
            {steps.map((step) => (
              <div key={step.number} className="col-12 col-md-6">
                <div className="card h-100">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-start">
                      <div 
                        className="me-3 fw-bold text-white rounded-circle d-flex align-items-center justify-content-center"
                        style={{ 
                          minWidth: '60px', 
                          height: '60px',
                          fontSize: '32px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        }}
                      >
                        {step.icon}
                      </div>
                      <div>
                        <div className="text-primary fw-bold mb-1">Passo {step.number}</div>
                        <h3 className="card-title text-dark mb-2">{step.title}</h3>
                        <p className="card-text text-secondary mb-0">{step.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Server Info Section */}
      <section className="py-5" style={{ backgroundColor: 'rgba(0, 123, 255, 0.1)' }}>
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-10 col-lg-8">
              <div className="card">
                <div className="card-body p-5 text-center">
                  <h2 className="display-3 fw-bold text-dark mb-4">Informações do Servidor</h2>
                  
                  <div className="mb-4">
                    <h4 className="text-secondary mb-2">IP do Servidor</h4>
                    <div className="p-3 bg-dark rounded">
                      <code className="text-white fs-4">play.astrallegacy.com</code>
                    </div>
                  </div>

                  <div className="row g-4 mt-4">
                    <div className="col-md-4">
                      <div className="p-3">
                        <div className="mb-2" style={{ fontSize: '32px' }}>🎯</div>
                        <h5 className="text-dark">Versão</h5>
                        <p className="text-secondary mb-0">1.19+</p>
                      </div>
                    </div>
                    
                    <div className="col-md-4">
                      <div className="p-3">
                        <div className="mb-2" style={{ fontSize: '32px' }}>👥</div>
                        <h5 className="text-dark">Jogadores</h5>
                        <p className="text-secondary mb-0">500+ online</p>
                      </div>
                    </div>
                    
                    <div className="col-md-4">
                      <div className="p-3">
                        <div className="mb-2" style={{ fontSize: '32px' }}>🌍</div>
                        <h5 className="text-dark">Localização</h5>
                        <p className="text-secondary mb-0">Brasil</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <a href="/registro" className="btn btn-primary btn-lg me-2">
                      Criar Conta
                    </a>
                    <a href="/regras" className="btn btn-outline-primary btn-lg">
                      Ver Regras
                    </a>
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

