import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="py-5" style={{ backgroundColor: 'rgba(1, 17, 26, 0.95)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-12 col-lg-6 my-auto px-4 text-center text-lg-start">
            <p className="text-white-50 mb-0">
              © Copyright 2022 <strong>Astral Legacy</strong>. Todos os direitos reservados.
              <br />
              <Link href="/imprint" className="text-primary">Impressum</Link> |{' '}
              <Link href="/privacidade" className="text-primary">Privacidade</Link> |{' '}
              <Link href="/termos" className="text-primary">Termos de Serviço</Link>
            </p>
          </div>
          <div className="col-md-12 col-lg-6 px-4 text-center text-lg-end mt-3 mt-lg-0">
            <div className="d-flex justify-content-center justify-content-lg-end gap-3">
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white"
                style={{ fontSize: '24px' }}
              >
                <i className="bi bi-youtube"></i>
              </a>
              <a 
                href="https://discord.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white"
                style={{ fontSize: '24px' }}
              >
                <i className="bi bi-discord"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

