import React, { useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppContext } from '@/context/AppContext';

const AuthLayout = () => {
  const { isAuthenticated } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return <Outlet />;
};

export default AuthLayout; 