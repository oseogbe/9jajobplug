import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { assets } from '@/assets/assets';
import { AppContext } from '@/context/AppContext';

const Navbar = () => {
  const { isAuthenticated, user } = useContext(AppContext);
  return (
    <div className='shadow py-4'>
        <div className='container px-4 2xl:px-20 mx-auto flex justify-between items-center'>
            <img src={assets.logo} alt="" />
            <div className="flex gap-4 max-sm:text-xs">
              {!isAuthenticated ? (
                <>
                  <button className='text-gray-600'>Post a Job</button>
                  <Link to="/login" className='bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full'>Login</Link>
                </>
              ) : (
                <span className="text-gray-700">Welcome{user?.name ? `, ${user.name}` : ''}!</span>
              )}
            </div>
        </div>
    </div>
  )
}

export default Navbar