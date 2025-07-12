import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

import { assets } from '@/assets/assets';

const Dashboard = () => {
  return (
    <>
      {/* left sidebar */}
      <div className="sm:min-w-[240px] border-r-2">
        <ul className="flex flex-col items-start pt-5 text-gray-800">
          <NavLink
            to={'/dashboard/add-job'}
            className={({ isActive }) =>
              `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && 'bg-blue-100 border-r-4 border-blue-500'}`
            }
          >
            <img src={assets.add_icon} alt="" className="min-w-4" />
            <p className='max-sm:hidden'>Add Job</p>
          </NavLink>
          <NavLink
            to={'/dashboard/manage-jobs'}
            className={({ isActive }) =>
              `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && 'bg-blue-100 border-r-4 border-blue-500'}`
            }
          >
            <img src={assets.home_icon} alt="" className="min-w-4" />
            <p className='max-sm:hidden'>Manage Jobs</p>
          </NavLink>
          <NavLink
            to={'/dashboard/view-applications'}
            className={({ isActive }) =>
              `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && 'bg-blue-100 border-r-4 border-blue-500'}`
            }
          >
            <img src={assets.person_tick_icon} alt="" className="min-w-4" />
            <p className='max-sm:hidden'>View Applications</p>
          </NavLink>
        </ul>
      </div>

      {/* Page Content */}
      <div className="flex-1">
        <Outlet />
      </div>
    </>
  );
};

export default Dashboard;
