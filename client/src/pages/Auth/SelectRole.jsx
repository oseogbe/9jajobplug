import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '@/context/AuthContext';
import { API_BASE_URL } from '@/utils/api';
import Spinner from '@/components/Spinner';

import { assets } from '@/assets/assets';

const SelectRole = () => {
  const navigate = useNavigate();
  const { user, setUser, accessToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  // Redirect if user already has a role
  useEffect(() => {
    if (user?.role === 'talent') {
      navigate('/');
    } else if (user?.role === 'recruiter') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleCardClick = (role) => {
    setSelectedRole(role);
    setError(null);
  };

  const handleConfirm = async () => {
    if (!selectedRole) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/users/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ role: selectedRole }),
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.data.user) {
        setUser(data.data.user);
        if (selectedRole === 'talent') navigate('/');
        else if (selectedRole === 'recruiter') navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to select account type');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-sm:min-h-screen py-32 flex items-center justify-center bg-gray-50 px-2">
      <div className="w-full max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-2 text-gray-900 text-center">
          Select your account type
        </h2>
        <p className="text-gray-500 text-center mb-8 text-sm sm:text-base">
          Please choose the option that best describes your goal.
        </p>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          {/* Talent Card */}
          <button
            type="button"
            className={`flex-1 w-full max-w-xs bg-white border rounded-lg shadow-sm px-6 py-8 flex flex-col items-start sm:items-center gap-2 transition text-left sm:text-center disabled:opacity-50 focus:outline-none
              ${selectedRole === 'talent' ? 'ring-4 ring-primary border-primary' : 'border-gray-200 hover:shadow-md focus:ring-2 focus:ring-primary'}`}
            onClick={() => handleCardClick('talent')}
            disabled={loading}
            aria-pressed={selectedRole === 'talent'}
          >
            <img
              src={assets.person_icon}
              alt="Talent"
              className="h-6 w-6 mb-2"
            />
            <span className="font-semibold text-lg text-gray-800">
              I'm looking for a job
            </span>
            <span className="inline-block mt-1 mb-2 px-3 py-1 text-xs rounded-full bg-primary/10 text-primary font-semibold">
              Talent
            </span>
            <span className="text-gray-500 text-sm">
              Find and apply for jobs, manage your applications, and build your
              career profile.
            </span>
          </button>
          {/* Recruiter Card */}
          <button
            type="button"
            className={`flex-1 w-full max-w-xs bg-white border rounded-lg shadow-sm px-6 py-8 flex flex-col items-start sm:items-center gap-2 transition text-left sm:text-center disabled:opacity-50 focus:outline-none
              ${selectedRole === 'recruiter' ? 'ring-4 ring-primary border-primary' : 'border-gray-200 hover:shadow-md focus:ring-2 focus:ring-primary'}`}
            onClick={() => handleCardClick('recruiter')}
            disabled={loading}
            aria-pressed={selectedRole === 'recruiter'}
          >
            <img
              src={assets.company_icon}
              alt="Recruiter"
              className="h-6 w-6 mb-2"
            />
            <span className="font-semibold text-lg text-gray-800">
              I'm hiring for my business
            </span>
            <span className="inline-block mt-1 mb-2 px-3 py-1 text-xs rounded-full bg-primary/10 text-primary font-semibold">
              Recruiter
            </span>
            <span className="text-gray-500 text-sm">
              Post jobs, manage applications, and find the best talent for your
              enterprise.
            </span>
          </button>
        </div>
        <div className="flex justify-center mt-8">
          {selectedRole && (
            <button
              type="button"
              className="bg-primary text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-primary-dark transition disabled:opacity-50"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? <Spinner /> : 'Confirm Selection'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectRole;
