import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
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
            <div className="col-12 col-md-6 text-center mb-4 mb-md-0 animate-fade-in">
              <Image 
                src="/images/512xnewhypixel.png" 
                alt="Astral Legacy" 
                width={300} 
                height={300}
                priority
              />
            </div>
            <div className="col-12 col-md-6 animate-fade-in">
              <h1 className="display-1 fw-bold mb-3">Astral Legacy</h1>
              <p className="fs-4 mb-4">
                Aventure-se em um universo épico de Minecraft! Junte-se à nossa comunidade e explore mundos incríveis.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link href="/como-entrar" className="btn btn-primary btn-lg">
                  Começar Agora
                </Link>
                <Link href="/#sobre" className="btn btn-outline-light btn-lg">
                  Saiba Mais
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre o Servidor */}
      <section id="sobre" className="py-5" style={{ backgroundColor: '#1a1a2e' }}>
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-12 col-lg-10 text-center mb-5">
              <h2 className="display-2 fw-bold mb-4">O que é Astral Legacy?</h2>
              <p className="fs-5 text-white-50">
                Astral Legacy é um servidor de Minecraft premium com uma comunidade ativa e diversos modos de jogo.
              </p>
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 text-dark">
                <div className="card-body text-center p-4">
                  <div className="mb-3" style={{ fontSize: '48px' }}>🎮</div>
                  <h3 className="card-title mb-3">Modos de Jogo</h3>
                  <p className="card-text">
                    Survival, Creative, PvP e muito mais. Sempre tem algo novo para explorar!
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 text-dark">
                <div className="card-body text-center p-4">
                  <div className="mb-3" style={{ fontSize: '48px' }}>👥</div>
                  <h3 className="card-title mb-3">Comunidade</h3>
                  <p className="card-text">
                    Junte-se a milhares de jogadores em uma comunidade amigável e acolhedora.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 text-dark">
                <div className="card-body text-center p-4">
                  <div className="mb-3" style={{ fontSize: '48px' }}>⚡</div>
                  <h3 className="card-title mb-3">Desempenho</h3>
                  <p className="card-text">
                    Servidores de alta performance para a melhor experiência de jogo possível.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5" style={{ backgroundColor: 'rgba(0, 123, 255, 0.1)' }}>
        <div className="container py-5">
          <div className="row justify-content-center text-center">
            <div className="col-md-10 col-lg-8">
              <h2 className="display-3 fw-bold mb-4">Pronto para começar?</h2>
              <p className="fs-5 mb-4">
                Crie sua conta agora e comece sua jornada no Astral Legacy!
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link href="/registro" className="btn btn-primary btn-lg">
                  Criar Conta
                </Link>
                <Link href="/loja" className="btn btn-warning btn-lg">
                  Ver VIPs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

