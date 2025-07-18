import React from 'react';
import { Outlet } from 'react-router-dom';

// import DashboardNavbar from '@/components/navbars/DashboardNavbar';
import Navbar from '@/components/navbars/Navbar';

const RecruiterLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 flex container px-4 2xl:px-20 mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default RecruiterLayout;
