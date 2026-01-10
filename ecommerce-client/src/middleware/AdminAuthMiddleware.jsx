import  React from 'react';

const AdminAuthMiddleware = ({children}) => {
  const isAuthenticated = Boolean(localStorage.getItem('adminToken'));
  if (!isAuthenticated) {
    window.location.href = '/admin/login';
    return null;
  }
  return children;
};

export default AdminAuthMiddleware;