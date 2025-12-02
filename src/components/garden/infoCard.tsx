import React from "react";

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
}

export const InfoCard: React.FC<InfoCardProps> = ({ icon, title, value }) => (
  <div className="d-flex align-items-center gap-3 p-3 bg-white rounded shadow-sm border">
    <div
      className="p-3 rounded-circle text-success"
      style={{ backgroundColor: "#d1f4e0" }}
    >
      {icon}
    </div>
    <div>
      <p className="text-secondary small mb-1 fw-medium">{title}</p>
      <p className="fs-5 fw-semibold mb-0">{value}</p>
    </div>
  </div>
);
