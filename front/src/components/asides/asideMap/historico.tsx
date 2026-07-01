import { LuAlarmClock } from "react-icons/lu";
import { MdOutlineWaterDrop } from "react-icons/md";

import { useMapStore } from "../../../stores/mapStore";

export const Historico = () => {
  const { currentGarden } = useMapStore();
  const history = currentGarden?.irrigationHistory ?? [];

  if (!history.length)
    return (
      <ul className="list-group">
        <li className="list-group-item">
          Nenhum histórico de irrigação encontrado.
        </li>
      </ul>
    );

  return (
    <ul className="list-group">
      {history.slice(0, 6).map((item, index) => (
        <li
          key={index}
          className="list-group-item d-flex align-items-center gap-2"
        >
          <LuAlarmClock />
          {new Date(item.timestamp).toLocaleDateString("pt-BR")}
          <MdOutlineWaterDrop />
          {item.volume.toFixed(3)}L
        </li>
      ))}
    </ul>
  );
};
