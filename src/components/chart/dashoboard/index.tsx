import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import type { Irrigations } from "../../../types/collection/irrigations";
import { irrigationHistory } from "../../../utils/irrigationHistory";

interface DashboardChartProps {
  gardenId: string;
}

export function DashboardChart({ gardenId }: DashboardChartProps) {
  const [history, setHistory] = useState<Irrigations[]>([]);

  useEffect(() => {
    irrigationHistory(gardenId).then(setHistory).catch(console.error);
  }, [gardenId]);

  const data = history
    .map((d) => ({
      temperatura: d.temperature,
      umidade: d.humidity,
      volume: d.volume,
      time: new Date(d.timestamp.seconds * 1000),
    }))
    .sort((a, b) => a.time.getTime() - b.time.getTime());

  return (
    <div className="dashboard-chart-container">
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="time"
            tickFormatter={(value: Date) =>
              value
                .toLocaleDateString("pt-BR", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
                .toUpperCase()
            }
          />

          <YAxis hide={screen.width < 800} />

          <Tooltip
            labelFormatter={(value: Date) =>
              value
                .toLocaleDateString("pt-BR", {
                  month: "short",
                  year: "numeric",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })
                .toUpperCase()
            }
            formatter={(value, name) => {
              switch (name) {
                case "temperatura":
                  return [`${value}°C`, "Temperatura"];
                case "umidade":
                  return [`${value}%`, "Umidade"];
                case "volume":
                  return [`${value} mL`, "Volume"];
                default:
                  return [value, name];
              }
            }}
            labelStyle={{ fontFamily: "Inter" }}
          />

          <Line type="monotone" dataKey="temperatura" stroke="#FFC107" />
          <Line type="monotone" dataKey="umidade" stroke="#0D6EFD" />
          <Line type="monotone" dataKey="volume" stroke="#188754" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
