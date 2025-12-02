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

interface DashboardChartProps {
  rawData: Irrigations[];
}

export function DashboardChart({ rawData }: DashboardChartProps) {
  const data = rawData.map((d) => ({
    ...d,
    time: new Date(d.timestamp.seconds * 1000),
  }));

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
          />

          <Line type="monotone" dataKey="temperature" stroke="#ff0000" />
          <Line type="monotone" dataKey="humidity" stroke="#0000ff" />
          <Line type="monotone" dataKey="volume" stroke="#00aa00" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
