import  React from 'react';

const AuthMiddleware = ({children}) => {
  const isAuthenticated = Boolean(localStorage.getItem('token'));
  if (!isAuthenticated) {
    window.location.href = '/auth/login';
    return null;
  }
  return children;
};

export default AuthMiddleware;