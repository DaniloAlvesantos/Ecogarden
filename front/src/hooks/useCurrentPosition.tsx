import { useState, useEffect, useMemo } from "react";
import Cookies from "universal-cookie";

export const useCurrentPosition = () => {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const cookies = useMemo(() => new Cookies(), []);

  useEffect(() => {
    const positionFromCookies = cookies.get("ecogarden-user-position");

    if (positionFromCookies) {
      setLoading(false);
      setPosition(positionFromCookies);
      return;
    }

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLoading(false);
        cookies.set("ecogarden-user-position", {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, [cookies]);

  return { position, error, loading };
};
