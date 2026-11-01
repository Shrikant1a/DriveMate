import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { SocketProvider } from './context/SocketContext.js';
import { LandingPage } from './pages/LandingPage.js';
import { BookingWizardPage } from './pages/BookingWizardPage.js';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage.js';
import { DriverDashboardPage } from './pages/DriverDashboardPage.js';
import { AdminDashboardPage } from './pages/AdminDashboardPage.js';

function ProtectedRoute({ children, allowedRoles }: { children: JSX.Element; allowedRoles: string[] }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080B10] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/book" element={<BookingWizardPage />} />
            
            {/* Customer Portal */}
            <Route
              path="/customer"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
                  <CustomerDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Driver Portal */}
            <Route
              path="/driver"
              element={
                <ProtectedRoute allowedRoles={['DRIVER', 'ADMIN']}>
                  <DriverDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Console */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;

