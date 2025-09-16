import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
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
import CustomOrderPage from './pages/CustomOrderPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/candles" element={<ProductsPage />} />
          <Route path="/custom" element={<CustomOrderPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/team/signup" element={<TeamSignupPage />} />
          <Route path="/team/login" element={<TeamLoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/liked" element={<LikedProductsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/team" element={<TeamPage />} />
          </Route>
        </Routes>

      </div>
    </Router>
  );
}

export default App;
