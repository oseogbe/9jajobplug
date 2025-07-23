import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { AuthContext } from '@/context/AuthContext';
import PasswordInput from '@/components/PasswordInput';
import Spinner from '@/components/Spinner';

import { assets } from '@/assets/assets';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const {
    register: rhfRegister,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    try {
      const result = await login(data);
      if (result.success) {
        toast.success('Logged in');
        const user = JSON.parse(localStorage.getItem('jobportal_user'));
        if (!user?.role) {
          navigate('/select-role');
        } else if (user.role === 'recruiter') {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      } else if (result.error?.error?.details) {
        for (const err of result.error.error.details) {
          if (err.field) setError(err.field, { message: err.message });
        }
      } else {
        toast.error(result.error?.message || 'Login failed');
      }
    } catch (err) {
      toast.error(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        className="bg-white p-8 pt-16 rounded-lg shadow-md w-full max-w-md space-y-6 max-sm:mx-4"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <div className="flex justify-center mb-4">
          <Link to="/">
            <img src={assets.logo} alt="Logo" className="h-10" />
          </Link>
        </div>
        <h3 className="text-xl font-normal text-center text-gray-500">
          login to your account
        </h3>
        <div>
          <div className={`border px-4 py-2 flex items-center gap-2 rounded mt-5 ${errors.email ? 'border-red-500' : ''}`}>
            <img src={assets.email_icon} alt="" />
            <input
              type="email"
              placeholder="Email"
              className="text-sm w-full"
              {...rhfRegister('email', { required: 'Email is required' })}
              required
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <PasswordInput
            name="password"
            placeholder="Password"
            icon={assets.lock}
            error={errors.password?.message}
            {...rhfRegister('password', { required: 'Password is required' })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Spinner /> : 'Login'}
        </button>
        <p className="text-center text-sm mt-2">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
