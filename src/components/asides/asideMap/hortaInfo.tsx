import { useMapStore } from "../../../stores/mapStore";

export const HortaInfo = () => {
  const { currentGarden } = useMapStore();
  if (!currentGarden) return null;

  const { owner, tamanhoM2, createdAt } = currentGarden.garden;

  return (
    <ul className="list-group">
      <li className="list-group-item">
        Tamanho: {tamanhoM2}m<sup>2</sup>
      </li>
      <li className="list-group-item">
        Criada em: {new Date(createdAt).toLocaleDateString("pt-BR")}
      </li>
      <li className="list-group-item">Responsável: {owner.name}</li>
      <li className="list-group-item text-truncate" title={owner.email}>
        Email: {owner.email}
      </li>
    </ul>
  );
};
