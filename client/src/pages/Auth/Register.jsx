import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { assets } from '@/assets/assets';
import { AppContext } from '@/context/AppContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useContext(AppContext);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'talent',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Basic UX: check required fields
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        name: !form.name ? 'Name is required' : undefined,
        email: !form.email ? 'Email is required' : undefined,
        password: !form.password ? 'Password is required' : undefined,
        confirmPassword: !form.confirmPassword ? 'Please confirm your password' : undefined,
      }));
      setIsSubmitting(false);
      return;
    }
    if (form.password !== form.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      setIsSubmitting(false);
      return;
    }

    try {
      const { confirmPassword, ...submitData } = form;
      const result = await register(submitData);
      if (result.success) {
        toast.success('Logged in');
        navigate('/');
      } else if (result.error?.error?.details) {
        const fieldErrors = {};
        for (const err of result.error.error.details) {
          if (err.field) fieldErrors[err.field] = err.message;
        }
        setErrors(fieldErrors);
      } else {
        toast.error(result.error?.message || 'Registration failed');
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <div className="flex justify-center mb-4">
          <Link to="/">
            <img src={assets.logo} alt="Logo" className="h-12" />
          </Link>
        </div>
        <h3 className="text-xl font-normal text-center text-gray-500">Create an Account</h3>
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400 ${errors.name ? 'border-red-500' : ''}`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400 ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400 ${errors.password ? 'border-red-500' : ''}`}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400 ${errors.confirmPassword ? 'border-red-500' : ''}`}
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
        <p className="text-center text-sm mt-2">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
