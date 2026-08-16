import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import ProblemsPage from "../pages/ProblemsPage";
import ProblemDetailsPage from "../pages/ProblemDetailsPage";
import RecommendationPage from "../pages/RecommendationPage";
import ProfilePage from "../pages/ProfilePage";
import SubmissionsPage from "../pages/SubmissionsPage";
import SubmissionDetailsPage from "../pages/SubmissionDetailsPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import AdminRoute from "./AdminRoute";

import ProtectedRoute from "./ProtectedRoute";

import AppLayout from "../components/layout/AppLayout";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Route */}
        <Route
          path="/"
          element={<LoginPage />}
        />

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />

          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="/problems"
            element={<ProblemsPage />}
          />

          <Route
            path="/problems/:id"
            element={<ProblemDetailsPage />}
          />

          <Route
            path="/submissions"
            element={<SubmissionsPage />}
          />

          <Route
            path="/submissions/:id"
            element={<SubmissionDetailsPage />}
          />

          <Route
            path="/recommendations"
            element={<RecommendationPage />}
          />

          <Route
            path="/profile"
            element={<ProfilePage />}
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}