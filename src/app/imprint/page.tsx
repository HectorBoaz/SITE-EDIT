export default function ImprintPage() {
  return (
    <div className="container py-5" style={{ marginTop: '80px', minHeight: '60vh' }}>
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <h1 className="display-2 fw-bold mb-4">Impressum</h1>
          
          <div className="card">
            <div className="card-body p-4">
              <h2 className="h4 text-dark mb-3">Informações Legais</h2>
              <p className="text-dark">
                Astral Legacy<br />
                Servidor de Minecraft<br />
                Brasil
              </p>

              <h3 className="h5 text-dark mt-4 mb-2">Contato</h3>
              <p className="text-dark">
                Email: contato@astrallegacy.com<br />
                Discord: discord.gg/astrallegacy
              </p>

              <h3 className="h5 text-dark mt-4 mb-2">Responsável</h3>
              <p className="text-dark">
                Equipe Astral Legacy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

