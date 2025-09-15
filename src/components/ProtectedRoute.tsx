import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
    const token = localStorage.getItem('aura-token');
    return token ? <Outlet /> : <Navigate to="/team/login" />;
};

export default ProtectedRoute;
