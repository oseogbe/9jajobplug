import React, { useContext, useState, useRef } from 'react';
import { User, Shield } from 'lucide-react';

import { AuthContext } from '@/context/AuthContext';
import { getProviderInfo } from '@/utils/emailProviderIcons';

import { assets } from '@/assets/assets';

const ManageAccount = () => {
  const { user } = useContext(AuthContext);
  const [selectedTab, setSelectedTab] = useState('profile');
  const [imagePreview, setImagePreview] = useState(
    user?.image || assets.profile_img || assets.upload_area,
  );
  const [hasCustomImage, setHasCustomImage] = useState(!!user?.image);
  const fileInputRef = useRef();

  // Dynamically build connected accounts
  const connectedAccounts = [
    (() => {
      const info = getProviderInfo(user?.email);
      return {
        provider: info.provider,
        email: user?.email,
        icon: info.icon,
      };
    })(),
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setHasCustomImage(true);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen sm:min-h-[70dvh]">
      <div className="container px-4 2xl:px-20 mx-auto flex flex-col md:flex-row py-6 md:py-12 gap-0 md:gap-8">
        {/* Sidebar or Top Nav */}
        <div className="w-full md:w-64 md:border-r flex flex-col md:py-8 md:px-6 bg-gray-50 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none max-sm:rounded-t-2xl max-sm:py-4 max-sm:px-0">
          {/* Mobile: horizontal nav, Desktop: vertical nav */}
          <div className="flex flex-col md:block">
            <h2 className="text-2xl font-semibold mb-1 md:mb-2 text-center md:text-left">Account</h2>
            <p className="text-gray-500 text-sm mb-4 md:mb-8 text-center md:text-left">
              Manage your account info.
            </p>
          </div>
          <nav className="flex md:flex-col gap-2 md:gap-2 w-full justify-center md:justify-start mb-4 md:mb-0 max-sm:flex-row max-sm:gap-2 max-sm:justify-center">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-center md:text-left transition font-medium w-full md:w-auto justify-center md:justify-start ${selectedTab === 'profile' ? 'bg-white shadow text-primary' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setSelectedTab('profile')}
            >
              <User size={18} /> <span className="max-sm:hidden">Profile</span>
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-center md:text-left transition font-medium w-full md:w-auto justify-center md:justify-start ${selectedTab === 'security' ? 'bg-white shadow text-primary' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setSelectedTab('security')}
              disabled
            >
              <Shield size={18} /> <span className="max-sm:hidden">Security</span>
            </button>
          </nav>
        </div>
        {/* Main content */}
        <main className="flex-1 p-4 md:p-10 bg-white shadow-lg rounded-2xl w-full">
          {selectedTab === 'profile' && (
            <section>
              <div className="flex items-center justify-between mb-8 max-sm:flex-col max-sm:gap-6 max-sm:items-center">
                <div className="flex items-center gap-4 w-full sm:w-auto max-sm:flex-col max-sm:w-full max-sm:justify-center max-sm:items-center">
                  <div className="relative group">
                    {hasCustomImage && imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="avatar"
                        className="w-20 h-20 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-gray-200 shadow-sm cursor-pointer mx-auto"
                        onClick={() => fileInputRef.current?.click()}
                      />
                    ) : (
                      <span
                        className="w-20 h-20 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 border-2 border-gray-200 shadow-sm cursor-pointer mx-auto"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <User size={40} />
                      </span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <button
                      type="button"
                      className="absolute bottom-1 right-1 bg-primary text-white rounded-full p-1 shadow hover:bg-primary-dark transition"
                      onClick={() => fileInputRef.current?.click()}
                      tabIndex={-1}
                    >
                      <svg
                        width="18"
                        height="18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 5v14M5 12h14"></path>
                      </svg>
                    </button>
                  </div>
                  <div className="text-center sm:text-left max-sm:mt-2">
                    <div className="font-semibold text-lg text-gray-800">
                      {user?.name || 'User Name'}
                    </div>
                  </div>
                </div>
                <button
                  className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition w-full sm:w-auto mt-4 sm:mt-0 max-sm:w-full max-sm:mt-4"
                  type="button"
                  onClick={() => {}}
                  disabled
                >
                  Update profile
                </button>
              </div>
              <div className="mb-8">
                <h4 className="font-semibold text-gray-700 mb-2">
                  Email addresses
                </h4>
                <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 mb-2 max-sm:flex-col max-sm:items-start">
                  <span className="text-gray-800 break-all">{user?.email}</span>
                  <span className="bg-gray-200 text-xs px-2 py-0.5 rounded-full">
                    Primary
                  </span>
                </div>
                <button
                  className="flex items-center gap-1 text-primary hover:underline text-sm mt-1"
                  type="button"
                  disabled
                >
                  + Add email address
                </button>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">
                  Connected accounts
                </h4>
                <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-4 max-sm:flex-col max-sm:items-start">
                  {connectedAccounts.map((acc, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg max-sm:w-full"
                    >
                      {acc.icon}
                      <span className="text-gray-700 text-sm">
                        {acc.provider}
                      </span>
                      <span className="text-gray-500 text-xs">
                        • {acc.email}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
          {selectedTab === 'security' && (
            <section className="text-gray-500 text-center py-20">
              <Shield size={32} className="mx-auto mb-4" />
              <div className="text-lg font-medium mb-2">
                Security settings coming soon
              </div>
              <div className="text-sm">
                You will be able to manage your password and authentication
                methods here.
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default ManageAccount;
