import React from 'react';
import { Outlet } from 'react-router-dom';

import DashboardNavbar from '@/components/navbars/DashboardNavbar';

const RecruiterLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <DashboardNavbar />
      <div className="flex-1 flex">
        <Outlet />
      </div>
    </div>
  );
};

export default RecruiterLayout;
