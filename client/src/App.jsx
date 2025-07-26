import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';

import RootLayout from '@/layouts/RootLayout';
import AuthLayout from '@/layouts/AuthLayout';
import RecruiterLayout from './layouts/RecruiterLayout';

import ProtectedRoute from '@/components/ProtectedRoute';

import Home from '@/pages/Home';
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
import SelectRole from '@/pages/Auth/SelectRole';
import ManageAccount from '@/pages/ManageAccount';
import ApplyJob from '@/pages/Talent/ApplyJob';
import Applications from '@/pages/Talent/Applications';
import Dashboard from '@/pages/Recruiter/Dashboard';
import AddJob from '@/pages/Recruiter/AddJob';
import ManageJobs from '@/pages/Recruiter/ManageJobs';
import ViewApplications from '@/pages/Recruiter/ViewApplications';
import AddBusiness from '@/pages/Recruiter/AddBusiness';
import Forbidden from '@/pages/Forbidden';

import RecruiterLogin from '@/components/modals/RecruiterLogin';

import { AppContext } from '@/context/AppContext';

import 'quill/dist/quill.snow.css';

const App = () => {
  const { showRecruiterLogin } = useContext(AppContext);

  return (
    <div>
      {showRecruiterLogin && <RecruiterLogin />}
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<RootLayout />}>
            <Route path="/select-role" element={<SelectRole />} />
            <Route path="/account" element={<ManageAccount />} />
            <Route path="/apply-job/:id" element={<ApplyJob />} />
          </Route>
        </Route>
        {/* Talent routes */}
        <Route element={<ProtectedRoute roles={['talent']} />}>
          <Route element={<RootLayout />}>
            <Route path="/applications" element={<Applications />} />
          </Route>
        </Route>
        {/* Recruiter routes */}
        <Route element={<ProtectedRoute roles={['recruiter']} />}>
          <Route element={<RecruiterLayout />}>
            <Route path="/dashboard" element={<Dashboard />}>
              <Route path="manage-jobs" element={<ManageJobs />} />
              <Route path="manage-jobs/add" element={<AddJob />} />
              <Route path="view-applications" element={<ViewApplications />} />
            </Route>
            <Route path="/add-business" element={<AddBusiness />} />
          </Route>
        </Route>
        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>
        {/* Forbidden page */}
        <Route path="/forbidden" element={<Forbidden />} />
      </Routes>
    </div>
  );
};

export default App;
