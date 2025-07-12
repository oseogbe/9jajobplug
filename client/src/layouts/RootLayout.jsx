import React from 'react';
import { Outlet } from 'react-router-dom';

import Navbar from '@/components/navbars/Navbar';
import Footer from '@/components/Footer';

const RootLayout = () => (
  <div>
    <Navbar />
    <Outlet />
    <Footer />
  </div>
);

export default RootLayout;
