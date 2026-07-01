import { FaDirections } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";

import { useMapStore } from "../../../stores/mapStore";

export const AsideHeader = () => {
  const { setShowAside, currentGarden } = useMapStore();
  if (!currentGarden) return null;

  const { garden, location } = currentGarden;

  return (
    <>
      <div className="position-absolute top-2 end-0 bg-light rounded">
        <IoIosClose
          onClick={() => setShowAside(false)}
          size={32}
          role="button"
        />
      </div>

      <div className="aside-map-image-container">
        <img src={garden.imgUrl} alt="Imagem da Horta" />
      </div>

      <div className="p-2">
        <p className="font-primary fs-5 fw-bold m-0 text-capitalize">
          {garden.name}
        </p>
        <p className="text-muted">
          {location.city}, {location.state}
        </p>

        <a
          target="_blank"
          rel="noreferrer"
          href={`https://maps.google.com/?q=${garden.lat},${garden.lng}`}
          className="btn btn-success w-100 rounded-pill px-4 d-flex align-items-center justify-content-center gap-2 fw-medium"
        >
          <FaDirections />
          Ir para
        </a>
      </div>
    </>
  );
};
