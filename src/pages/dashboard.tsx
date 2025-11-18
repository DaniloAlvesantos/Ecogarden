import { AsideDashboard } from "../components/asides/asideDashboard";
import { Header } from "../components/header";

export function DashboardPage() {
  return (
    <>
      <Header navigation={[]} />
      <hr />
      <section className="row container-fluid">
        <AsideDashboard />
        <main className="col-10">
          <section>
            <div>
              <h1>Dashboard</h1>
              <p className="text-eco-mutated">Seja bem vindo ao Dashboard</p>
            </div>

            <div className="row gap-4 container-fluid">
              <div className="card col-3">
                <div className="card-body">
                  <h5 className="card-title text-eco-green-500">
                    <strong>5</strong> - Hortas Cadastradas
                  </h5>
                  <a
                    href="#"
                    className="card-link text-decoration-underline text-primary"
                  >
                    Minhas hortas
                  </a>
                </div>
              </div>

              <div className="card col-3">
                <div className="card-body">
                  <h5 className="card-title text-eco-green-500">
                    Volume d'gua: 500ML
                  </h5>
                  <a
                    href="#"
                    className="card-link text-decoration-underline text-primary"
                  >
                    Monitorar horta
                  </a>
                </div>
              </div>

              <div className="card col-3">
                <div className="card-body">
                  <h5 className="card-title text-eco-green-500">
                    <strong>5</strong> - Hortas Cadastradas
                  </h5>
                  <a
                    href="#"
                    className="card-link text-decoration-underline text-primary"
                  >
                    Minhas hortas
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>
      </section>
    </>
  );
}
