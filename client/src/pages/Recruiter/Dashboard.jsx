import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

import { assets } from '@/assets/assets';

const Dashboard = () => {
  return (
    <>
      {/* left sidebar */}
      <div className="sm:w-[240px] border-r-2 flex flex-col justify-between bg-gray-50">
        {/* sidebar links */}
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
        {/* premium plan section */}
        <div className="max-sm:hidden m-4 p-4 rounded-xl bg-white shadow flex flex-col items-start">
          <span className="text-blue-600 font-semibold mb-1">Recruiter Pro</span>
          <p className="text-sm text-gray-700 mb-3">Unlock premium features to boost your hiring process and reach more talents.</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">Subscribe Now</button>
        </div>
      </div>

      {/* Page Content */}
      <div className="">
        <Outlet />
      </div>
    </>
  );
};

export default Dashboard;
