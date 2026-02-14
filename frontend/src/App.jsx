import { Navigate, Route, Routes } from "react-router-dom";
import ErrorBoundary from "./components/common/ErrorBoundary.jsx";
import PublicLayout from "./components/layout/PublicLayout.jsx";
import ProtectedRoute from "./components/routing/ProtectedRoute.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage.jsx";
import AdminBookingsPage from "./pages/admin/AdminBookingsPage.jsx";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage.jsx";
import AdminServicesPage from "./pages/admin/AdminServicesPage.jsx";
import AdminUsersPage from "./pages/admin/AdminUsersPage.jsx";
import HomePage from "./pages/public/HomePage.jsx";
import LoginPage from "./pages/public/LoginPage.jsx";
import RegisterPage from "./pages/public/RegisterPage.jsx";
import ServiceDetailsPage from "./pages/public/ServiceDetailsPage.jsx";
import ServicesPage from "./pages/public/ServicesPage.jsx";
import NotFoundPage from "./pages/shared/NotFoundPage.jsx";
import UserBookingsPage from "./pages/user/UserBookingsPage.jsx";
import UserProfilePage from "./pages/user/UserProfilePage.jsx";
import UserReviewsPage from "./pages/user/UserReviewsPage.jsx";

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={["user", "admin"]} />}>
          <Route path="/dashboard/bookings" element={<UserBookingsPage />} />
          <Route path="/dashboard/profile" element={<UserProfilePage />} />
          <Route path="/dashboard/reviews" element={<UserReviewsPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/analytics" replace />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="services" element={<AdminServicesPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="bookings" element={<AdminBookingsPage />} />
            <Route path="users" element={<AdminUsersPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
}
