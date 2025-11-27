import { memo, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "./map.scss";

import { useCurrentPosition } from "../../../hooks/useCurrentPosition";
import { useGetGardens } from "../../../hooks/useGetGardens";
import { ErrorView } from "../../../views/error/error";
import { EcoGardenMarker } from "../../markers/ecoGardenMarker";
import { UserMarker } from "../../markers/userMarker";

function MapRecenter({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();
  const zoom = 16;

  useEffect(() => {
    if (center?.lat && center?.lng) {
      map.setView([center.lat, center.lng], zoom);
    }
  }, [center, map, zoom]);

  return null;
}

function EcoGardenMapComp() {
  const { position: currentPosition, loading: isLoadingPosition } =
    useCurrentPosition();
  const { isLoading, ...gardens } = useGetGardens();
  console.log({ gardens });

  const defaultFallbackPosition = { lat: -22.436, lng: -46.821 };

  const position =
    isLoadingPosition || !currentPosition
      ? defaultFallbackPosition
      : currentPosition;

  const mapCenter: typeof currentPosition = {
    lat: position.lat,
    lng: position.lng,
  };

  if (!gardens.data && !isLoading) {
    return <ErrorView />;
  }

  return (
    <MapContainer center={mapCenter} zoom={16} className="map">
      <MapRecenter center={position} />

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {gardens.data?.map((garden) => {
        return (
          <EcoGardenMarker
            position={[garden.garden.lat, garden.garden.lng]}
            imageUrl={garden.garden.imgUrl}
            title={garden.garden.name}
            gardenId={garden.garden.id}
            key={garden.garden.id}
          />
        );
      })}

      <UserMarker
        position={[mapCenter.lat, mapCenter.lng]}
        key={"user-marker"}
      />
    </MapContainer>
  );
}

export const EcoGardenMap = memo(EcoGardenMapComp);
