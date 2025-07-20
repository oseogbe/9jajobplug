import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { AuthContext } from '@/context/AuthContext';

import Loading from '@/components/Loading';

/**
 * ProtectedRoute
 * - Checks if user is authenticated
 * - Optionally checks if user has one of the allowed roles
 * - Redirects to login if not authenticated
 * - Redirects to /forbidden if authenticated but not authorized
 *
 * @param {string[]} roles - Array of allowed roles (optional)
 * @returns {JSX.Element}
 */
const ProtectedRoute = ({ roles }) => {
  const { isAuthenticated, user, loadingUser } = useContext(AuthContext);
  const location = useLocation();

  if (loadingUser) {
    // Use the shared Loading spinner
    return <Loading />;
  }

  if (!isAuthenticated) {
    // Not logged in, redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user has no role and is not on /select-role, redirect to /select-role
  if (user && (!user.role || user.role === null) && location.pathname !== '/select-role') {
    return <Navigate to="/select-role" replace />;
  }

  // If roles are specified, check for authorization
  if (roles && roles.length > 0 && (!user || !roles.includes(user.role))) {
    return <Navigate to="/forbidden" replace />;
  }

  // Otherwise, render the child routes
  return <Outlet />;
};

export default ProtectedRoute; 