import { IoIosAddCircleOutline } from "react-icons/io";
import { Link } from "react-router-dom";

import { Header } from "../components/header";
import { useGetUserGardens } from "../hooks/useGetUserGardens";

export const MyGardens = () => {
  const { data, isLoading, isError } = useGetUserGardens();

  const gardens = data?.gardens || [];

  return (
    <>
      <Header
        navigation={[
          { title: "Home", url: "/" },
          { title: "Dashboard", url: "/dashboard", isFeature: true },
        ]}
      />
      <section className="my-4">
        <div>
          <h1>Suas hortas</h1>
          <p className="text-eco-mutated">Veja suas hortas</p>
        </div>

        {isLoading ? (
          <div className="text-center p-5">Carregando hortas...</div>
        ) : null}

        {isError ? (
          <div className="text-center p-5">Erro ao carregar as hortas.</div>
        ) : null}

        {gardens.length ? (
          <table
            className="table table-striped table-hover"
            // @ts-expect-error bootstrap vars
            style={{ "--bs-table-bg": "var(--eco-light)" }}
          >
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Nome</th>
                <th scope="col">CEP</th>
                <th scope="col">
                  Tamanho m<sup>2</sup>
                </th>
                <th scope="col">Criado em</th>
              </tr>
            </thead>
            <tbody>
              {gardens.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center">
                    Nenhuma horta encontrada.
                  </td>
                </tr>
              ) : (
                gardens.map((garden, index) => (
                  <tr key={garden.id}>
                    <th scope="row">{index + 1}</th>
                    <td>
                      <Link
                        to={`/dashboard/garden/${garden.id}`}
                        className="text-decoration-underline text-primary"
                      >
                        {garden.name}
                      </Link>
                    </td>
                    <td>{garden.cep}</td>
                    <td>{garden.tamanhoM2}</td>
                    <td>{new Date(garden.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
              <tr>
                <td colSpan={5} className="text-center">
                  <Link
                    to="/dashboard/garden/create"
                    className="btn btn-link p-0 text-dark"
                  >
                    Adicionar <IoIosAddCircleOutline />
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        ) : null}
      </section>
    </>
  );
};
