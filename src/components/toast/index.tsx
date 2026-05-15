import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

import { db } from "../../lib/firebase";

interface ToastState {
  show: boolean;
  message: string;
  type: "success" | "danger" | "warning";
}

export const ToastDashboard = ({ gardenId }: { gardenId: string }) => {
  const [state, setState] = useState<ToastState>({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    const ref = doc(db, "garden", gardenId);

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      if (!snapshot.exists()) return;

      const data = snapshot.data();

      const message = data?.state?.message;
      const timestamp = data?.state?.timestamp;

      if (!message || !timestamp) return;

      // Ignore old events
      const isRecent = timestamp.toMillis() > Date.now() - 5000;

      if (!isRecent) return;

      if (message === "Starting irrigation...") {
        setState({
          show: true,
          message: "Irrigação iniciada!",
          type: "warning",
        });
      } else if (message === "Success") {
        setState({
          show: true,
          message: "Irrigação finalizada!",
          type: "success",
        });
      } else {
        setState({
          show: true,
          message,
          type: "danger",
        });
      }
    });

    return () => unsubscribe();
  }, [gardenId]);

  if (!state.show) return null;

  return (
    <div
      className="toast show position-fixed bottom-0 end-0 m-4"
      style={{ zIndex: 9999 }}
    >
      <div
        className={`toast-header bg-${
          state.type === "success"
            ? "success"
            : state.type === "warning"
              ? "warning"
              : "danger"
        } text-white`}
      >
        <strong className="me-auto">EcoGarden</strong>

        <button
          className="btn-close btn-close-white"
          onClick={() =>
            setState((prev) => ({
              ...prev,
              show: false,
            }))
          }
        />
      </div>

      <div className="toast-body">{state.message}</div>
    </div>
  );
};
