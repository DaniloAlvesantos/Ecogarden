import { useCallback, useState } from "react";

import { AsideDashboard } from "../components/asides/asideDashboard";
import { Header } from "../components/header";
import {
  DashboardViews,
  type DashboardViewHref,
  type DashboardViewsProps,
} from "../constants/dashboard";

export function DashboardPage() {
  const [view, setView] = useState<DashboardViewsProps>(DashboardViews[0]);

  const handleView = useCallback((targetView: DashboardViewHref) => {
    const target = DashboardViews.find((view) => view.href === targetView);

    if (!target) return;

    setView(target);
  }, []);

  const isViewDashboard = view?.href === "dashboard";
  const CurrentView = view?.Component ?? DashboardViews[0].Component;

  return (
    <>
      <Header navigation={[{ title: "Home", url: "/", isFeature: true }]} />
      <hr />
      <section className="row container-fluid" style={{ height: "100dvh" }}>
        <AsideDashboard changeView={handleView} />
        <main className="col-lg-10 col-md-9 col-12">
          {!isViewDashboard ? (
            <span
              className="btn btn-link p-0"
              onClick={() => handleView("dashboard")}
            >
              Voltar
            </span>
          ) : null}
          <CurrentView changeView={handleView} />
        </main>
      </section>
    </>
  );
}
