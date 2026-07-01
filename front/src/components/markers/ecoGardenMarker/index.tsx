import L from "leaflet";
import { Marker, Popup } from "react-leaflet";

import "./style.scss";
import { useGetGarden } from "../../../hooks/useGetGarden";
import { useMapStore } from "../../../stores/mapStore";

const createCircularImageIcon = (imageUrl: string, size: number = 40) => {
  return L.divIcon({
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        background-image: url('${imageUrl}');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      "></div>
    `,
    className: "circular-image-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

interface EcoGardenMarkerProps {
  position: [number, number];
  imageUrl: string;
  title: string;
  gardenId: string;
}

export const EcoGardenMarker = ({
  position,
  imageUrl,
  title,
  gardenId,
}: EcoGardenMarkerProps) => {
  const { setShowAside, setCurrentGarden } = useMapStore();

  const garden = useGetGarden(gardenId);

  if (!garden) {
    return;
  }

  const icon = createCircularImageIcon(imageUrl, 60);

  const handleSelectGarden = () => {
    // Only proceed if we have garden data
    if (garden) {
      setCurrentGarden(garden.data);
      setShowAside(true);
    }
  };

  return (
    <Marker position={position} icon={icon}>
      <Popup>
        <div className="py-1">
          <img
            src={imageUrl}
            alt={`Garden: ${title}`}
            className="col-12 w-100 img-fluid rounded my-2"
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/300x200?text=Garden+Image";
            }}
          />
          <strong className="font-primary col-12 fs-6 text-capitalize">{title}</strong>

          <button
            className="btn btn-sm btn-outline-success col-12 mt-2 rounded-pill"
            onClick={handleSelectGarden}
            disabled={garden.isLoading || garden.isError || !garden}
            aria-label={`View more details about ${title}`}
          >
            {garden.isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-1"
                  role="status"
                  aria-hidden="true"
                ></span>
                Carregando...
              </>
            ) : garden.isError ? (
              "Erro ao carregar"
            ) : (
              "Ver mais"
            )}
          </button>
        </div>
      </Popup>
    </Marker>
  );
};
