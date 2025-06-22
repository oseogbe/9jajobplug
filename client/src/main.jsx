import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { AuthContextProvider } from '@/context/AuthContext';
import { AppContextProvider } from '@/context/AppContext';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppContextProvider>
      <AuthContextProvider>
        <App />
        <Toaster position="top-center" />
      </AuthContextProvider>
    </AppContextProvider>
  </BrowserRouter>,
);
