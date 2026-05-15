import { LuLoader } from "react-icons/lu";
import { useParams } from "react-router-dom";

import { GardenDetails } from "../../components/garden/gardenDetails";
import { Header } from "../../components/header";
import { ToastDashboard } from "../../components/toast";
import { useGetGarden } from "../../hooks/useGetGarden";
import { ErrorView } from "../error/error";

import "./garden.scss";

export const GardenView = () => {
  const { gardenId } = useParams<{ gardenId: string }>();

  const { data: gardenData, isLoading, error } = useGetGarden(gardenId || "");

  if (!gardenId) {
    return (
      <div className="text-center p-5 fs-4 text-danger">
        Error: Garden ID is missing.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="d-flex flex-column align-items-center p-4 bg-white rounded shadow-lg">
          <LuLoader
            className="text-success"
            size={40}
            style={{ animation: "spin 1s linear infinite" }}
          />
          <p className="mt-3 text-secondary fw-medium">Loading Garden...</p>
        </div>
      </div>
    );
  }

  if (error || !gardenData) {
    return <ErrorView />;
  }

  return (
    <>
      <Header
        navigation={[
          { title: "Dashboard", url: "/" },
          { title: "Hortas", url: "/dashboard/my/gardens", isFeature: true },
        ]}
      />
      <div className="min-vh-100">
        <GardenDetails initialGardenData={gardenData} />
        <ToastDashboard gardenId={gardenId} />
      </div>
    </>
  );
};
