import React, { useContext, useRef, useState, useEffect } from 'react';
import { AppContext } from '@/context/AppContext';
import { assets } from '@/assets/assets';
import { User } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserButton = () => {
  const { user, logout } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  if (!user) return null;

  const avatar = user.image
    ? <img src={user.image} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
    : <span className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-500"><User size={24} /></span>;

  return (
    <div className="relative" ref={ref}>
      <button
        className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition flex items-center justify-center"
        onClick={() => setOpen((v) => !v)}
        aria-label="User menu"
        type="button"
      >
        {avatar}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg z-50 border border-gray-100">
          <div className="flex items-center gap-3 px-5 py-4 border-b">
            {user.image
              ? <img src={user.image} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
              : <span className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 text-gray-500"><User size={32} /></span>
            }
            <div>
              <div className="font-semibold text-gray-800">{user.name}</div>
              <div className="text-sm text-gray-500 truncate">{user.email}</div>
            </div>
          </div>
          <div className="flex flex-col divide-y">
            <Link
              to="/account"
              className="px-5 py-3 flex items-center gap-2 hover:bg-gray-50 transition text-gray-700"
              onClick={() => setOpen(false)}
            >
              <span className="inline-block w-5"><User size={18} /></span>
              Manage account
            </Link>
            <button
              className="px-5 py-3 flex items-center gap-2 hover:bg-gray-50 transition text-gray-700 text-left"
              onClick={async () => { setOpen(false); await logout(); }}
              type="button"
            >
              <span className="inline-block w-5"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7"></path><path d="M9 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4"></path></svg></span>
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserButton;