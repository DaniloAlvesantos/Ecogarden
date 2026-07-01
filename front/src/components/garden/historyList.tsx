import React from "react";
import { LuDroplets } from "react-icons/lu";

import type { IrrigationHistoryModel } from "../../types/api/api.history";

interface HistoryListProps {
  history: IrrigationHistoryModel[];
}

export const HistoryList: React.FC<HistoryListProps> = ({ history }) => (
  <div className="p-4 bg-white rounded shadow-lg border h-100">
    <h3 className="fs-4 fw-bold mb-3 d-flex align-items-center">
      <LuDroplets className="me-2 text-primary" size={20} />
      Irrigações recentes
    </h3>

    <ul
      className="list-unstyled"
      style={{
        maxHeight: "350px",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {history.map((h, index) => (
        <li
          key={index}
          className="d-flex justify-content-between align-items-center p-3 bg-light rounded mb-2"
        >
          <span>{new Date(h.timestamp).toLocaleString()}</span>
          <span className="text-primary fw-semibold">{h.volume} ML</span>
        </li>
      ))}
    </ul>
  </div>
);
