import React, { useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { assets } from '@/assets/assets';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // If the current path is exactly /dashboard, redirect to /dashboard/manage-jobs
    if (location.pathname === '/dashboard') {
      navigate('/dashboard/manage-jobs', { replace: true });
    }
  }, [location, navigate]);

  return (
    <>
      {/* left sidebar */}
      <div className="sm:w-[240px] flex flex-col justify-between bg-white shadow rounded-xl my-8">
        {/* sidebar links */}
        <ul className="flex flex-col items-start pt-5 text-gray-800">
          <NavLink
            to={'/dashboard/manage-jobs'}
            className={() =>
              `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${location.pathname.startsWith('/dashboard/manage-jobs') ? 'bg-primary/15 border-r-4 border-primary/80' : ''}`
            }
          >
            <img src={assets.home_icon} alt="" className="min-w-4" />
            <p className='max-sm:hidden'>Manage Jobs</p>
          </NavLink>
          <NavLink
            to={'/dashboard/view-applications'}
            className={({ isActive }) =>
              `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && 'bg-primary/15 border-r-4 border-primary/80'}`
            }
          >
            <img src={assets.person_tick_icon} alt="" className="min-w-4" />
            <p className='max-sm:hidden'>View Applications</p>
          </NavLink>
          <NavLink
            to={'/add-business'}
            className={({ isActive }) =>
              `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && 'bg-primary/15 border-r-4 border-primary/80'}`
            }
          >
            <img src={assets.add_icon} alt="" className="min-w-4" />
            <p className='max-sm:hidden'>Create Business</p>
          </NavLink>
        </ul>
        {/* premium plan section */}
        <div className="max-sm:hidden m-4 p-4 rounded-xl bg-gray-50 shadow flex flex-col items-start">
          <span className="text-primary font-semibold mb-1">Recruiter Pro</span>
          <p className="text-sm text-gray-700 mb-3">Unlock premium features to boost your hiring process and reach more talents.</p>
          <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition">Subscribe Now</button>
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1 max-sm:ml-4 ml-8 my-8">
        <Outlet />
      </div>
    </>
  );
};

export default Dashboard;
