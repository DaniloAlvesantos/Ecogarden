import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import Gnome from "/gnome-1.png";

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
        background-size: contain;
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

export const UserMarker = ({ position }: { position: [number, number] }) => {
  const icon = createCircularImageIcon(Gnome);

  return (
    <Marker position={position} icon={icon}>
      <Popup>
        <p className="fs-6 fw-bold text-center">Você</p>
      </Popup>
    </Marker>
  );
};
