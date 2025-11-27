import { Routes, Route } from "react-router-dom";

import { App } from "../App";
import { GardenForm } from "../components/forms/garden";
import { ProtectedRoute } from "../contexts/auth";
import { DashboardPage } from "../pages/dashboard";
import { Garden } from "../pages/garden";
import { LoginPage } from "../pages/login";
import { MapPage } from "../pages/map";
import { MyGardens } from "../pages/myGardens";
import { SignUpPage } from "../pages/signUp";
import { NotFoundPage } from "../views/notFound/notFound";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route
        path="/dashboard/garden/create"
        element={
          <ProtectedRoute>
            <GardenForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/my/gardens"
        element={
          <ProtectedRoute>
            <MyGardens />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/garden/:gardenId"
        element={
          <ProtectedRoute>
            <Garden />
          </ProtectedRoute>
        }
      />
      {/* Catch-all 404 route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
