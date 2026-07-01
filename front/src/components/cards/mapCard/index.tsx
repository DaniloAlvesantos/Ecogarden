interface MapCardSensorProps {
  header: string;
  title: string;
  text: string;
  progress: number;
  progressStyle: "info" | "success" | "danger" | "warning" | "primary";
}

const MapCardSensor = (props: MapCardSensorProps) => {
  const { header, progress, progressStyle, text, title } = props;
  const bg = `bg-${progressStyle}`;
  return (
    <div className="card my-2">
      <h5 className="card-header">{header}</h5>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{text}</p>
        <div
          className="progress"
          role="progressbar"
          aria-label="Success example"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={`progress-bar ${bg}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

interface MapCardPlant {
  name: string;
  nameCi: string;
  quant: number;
}

const MapCardPlant = ({ name, nameCi, quant }: MapCardPlant) => {
  return (
    <div className="card my-2">
      <h5 className="card-header">{name}</h5>
      <div className="card-body">
        <span className="card-text">
          <ul className="list-group">
            <li className="list-group-item">Nome Cientifico: {nameCi}</li>
            <li className="list-group-item">Quantidade: {quant}</li>
          </ul>
        </span>
      </div>
    </div>
  );
};

const MapCard = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

MapCard.Sensor = MapCardSensor;
MapCard.Plant = MapCardPlant;

export { MapCard };
