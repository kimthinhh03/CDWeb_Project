import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role?.name !== 'ROLE_ADMIN') {
        return <Navigate to="/" replace />;
    }
    return children;
};

export default AdminRoute;