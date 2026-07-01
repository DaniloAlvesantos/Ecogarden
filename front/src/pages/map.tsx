import { AsideMap } from "../components/asides/asideMap";
import { EcoGardenMap } from "../components/maps/EcoGardenMap";
import { useMapStore } from "../stores/mapStore";

export function MapPage() {
  const { showAside } = useMapStore();

  return (
    <section className="d-flex">
      <AsideMap show={showAside} />
      <EcoGardenMap />
    </section>
  );
}
