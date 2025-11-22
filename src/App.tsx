import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { LoginPage } from './pages/Login';
import { SignupPage } from './pages/SignupPage';
import { TeamPage } from './pages/TeamPage';
import TeamSignupPage from './pages/TeamSignupPage';
import TeamLoginPage from './pages/TeamLoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { LikedProductsPage } from './pages/LikedProductsPage';
import { CartPage } from './pages/CartPage';
import CandleDetailsPage from './pages/CandleDetailsPage';
import CustomOrderPage from './pages/CustomOrderPage';
import { LegalPage } from './pages/LegalPage';
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './context/CartContext';
import { FilterProvider } from './context/FilterContext';
import OrderHistoryPage from './pages/OrderHistoryPage';

function App() {

  return (
    <Router>
      <FilterProvider>
        <CartProvider>
          <div className="min-h-screen bg-white">
            <Navbar />
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/candles" element={<ProductsPage />} />
              <Route path="/candles/:id" element={<CandleDetailsPage />} />
              <Route path="/custom" element={<CustomOrderPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/team/signup" element={<TeamSignupPage />} />
              <Route path="/team/login" element={<TeamLoginPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/liked" element={<LikedProductsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/orders" element={<OrderHistoryPage />} />
              <Route path="/legal" element={<LegalPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/team" element={<TeamPage />} />
              </Route>
            </Routes>
            <Footer />
          </div>
        </CartProvider>
      </FilterProvider>
    </Router>
  );
}

export default App;

function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [location.pathname, location.search, location.hash]);
  return null;
}
