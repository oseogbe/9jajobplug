import React from 'react';
import { Link } from 'react-router-dom';

import UserButton from '@/components/UserButton';

import { assets } from '@/assets/assets';

const DashboardNavbar = () => {
  return (
    <div className="shadow py-4">
      <div className="container px-4 sm:px-6 mx-auto flex justify-between items-center">
        <Link to="/">
          <img src={assets.logo} alt="" className="max-sm:w-32" />
        </Link>
        <div className="flex gap-4 max-sm:text-xs">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="max-sm:hidden">
              Dashboard
            </Link>
            <p></p>
            <UserButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNavbar;
