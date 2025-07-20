import React, { useContext, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';

const AuthLayout = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated && user?.role === 'recruiter') {
      navigate('/dashboard');
    } else if (isAuthenticated && user?.role === 'talent') {
      navigate('/');
    } else if (isAuthenticated && !user?.role && location.pathname !== '/select-role') {
      navigate('/select-role');
    }
  }, [isAuthenticated, user, navigate, location.pathname]);

  return <Outlet />;
};

export default AuthLayout;
