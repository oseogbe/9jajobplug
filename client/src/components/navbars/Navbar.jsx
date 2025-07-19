import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { AppContext } from '@/context/AppContext';
import { AuthContext } from '@/context/AuthContext';

import UserButton from '@/components/UserButton';

import { assets } from '@/assets/assets';

const Navbar = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  const { setShowRecruiterLogin } = useContext(AppContext);

  return (
    <div className="bg-white shadow py-4">
      <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">
        <Link to="/">
          <img src={assets.logo} alt="" className="max-sm:w-32 w-40" />
        </Link>
        <div className="flex gap-4 max-sm:text-xs">
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => setShowRecruiterLogin(true)}
                className="text-gray-600"
              >
                Post a Job
              </button>
              <Link
                to="/login"
                className="bg-primary text-white px-6 sm:px-9 py-2 rounded-full"
              >
                Login
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              {/* Only show for talent users */}
              {user?.role === 'talent' && (
                <Link to={'/applications'} className="max-sm:hidden ">
                  Applied Jobs
                </Link>
              )}
              {/* Only show for recruiter users */}
              {user?.role === 'recruiter' && (
                <Link to="/dashboard" className="max-sm:hidden">
                  Dashboard
                </Link>
              )}
              <p></p>
              <UserButton />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
