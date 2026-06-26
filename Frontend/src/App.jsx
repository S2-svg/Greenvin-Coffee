import React from 'react';
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from './components/ScrollToTop.jsx';
import { OrderProvider } from './contexts/OrderContext.jsx';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import HomePage from './page/HomePage.jsx';
import MenuPage from './page/MenuPage.jsx';
import AboutPage from './page/AboutPage.jsx';
import GalleryPage from './page/GalleryPage.jsx';
import ContactPage from './page/ContactPage.jsx';
import OrderPage from './page/OrderPage.jsx';
import OrdersPage from './page/OrdersPage.jsx';
import POSPage from './page/POSPage.jsx';
import KDSPage from './page/KDSPage.jsx';
import AdminLoginPage from './page/AdminLoginPage.jsx';
import AdminDashboard from './page/AdminDashboard.jsx';
import AdminLayout from './page/AdminLayout.jsx';
import AdminMenuPage from './page/AdminMenuPage.jsx';
import AdminOrdersPage from './page/AdminOrdersPage.jsx';
import AdminSettingsPage from './page/AdminSettingsPage.jsx';
import GlobalAuthDialog from './components/GlobalAuthDialog.jsx';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
}

function App() {
  return (
    <OrderProvider>
      <AuthProvider>
        <GlobalAuthDialog />
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/pos" element={<POSPage />} />
            <Route path="/kds" element={<KDSPage />} />

            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="menu" element={<AdminMenuPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
                  <p className="text-xl text-muted-foreground mb-8">Page not found</p>
                  <a href="/" className="text-primary hover:underline">Back to home</a>
                </div>
              </div>
            } />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </OrderProvider>
  );
}

export default App;
