import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Layout from "./Theme/layout.jsx";

import Landing from "./pages/Landing.jsx";
import ProductListing from "./pages/ProductListing.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import ShoppingCartPage from "./pages/ShoppingCart.jsx";
import AuthPages from "./pages/AuthPage.jsx";
import AdminPanel from "./pages/admin.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import CheckoutPage from "./pages/Checkout.jsx";

import AuthMiddleware from "./middleware/AuthMiddleware.jsx";
import AuthMiddleware from "./middleware/AdminAuthMiddleware.jsx";

import Footer from "./components/Footer.jsx";
import "./App.css";

function App() {
  const location = useLocation();
  const isAdminPage =
    location.pathname.startsWith("/admin") || location.pathname === "/user";

  return (
    <>
      {!isAdminPage && <Navbar />}
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/products" element={<ProductListing />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/cart" element={<ShoppingCartPage />} />
          <Route path="/auth/*" element={<AuthPages />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route
            path="/admin"
            element={
              <AdminAuthMiddleware>
                <AdminPanel />
              </AdminAuthMiddleware>
            }
          />
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route path="*" element={<div>404 Not Found</div>} />
          <Route
            path="/user"
            element={
              <AuthMiddleware>
                <UserProfile />
              </AuthMiddleware>
            }
          />
        </Routes>
      </Layout>
      {!isAdminPage && <Footer />}
    </>
  );
}

export default App;
