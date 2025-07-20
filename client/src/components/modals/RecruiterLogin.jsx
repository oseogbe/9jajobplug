import { assets } from '@/assets/assets';
import { AppContext } from '@/context/AppContext';
import React, { useContext, useEffect, useState } from 'react';

const RecruiterLogin = () => {
  const [state, setState] = useState('Login');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(false);
  const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false);

  const { setShowRecruiterLogin } = useContext(AppContext);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (state === 'Sign Up' && !isTextDataSubmitted) {
      setIsTextDataSubmitted(true);
    }
  };

  return (
    <div className="absolute top-0 left-0 bottom-0 right-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <form
        onSubmit={onSubmitHandler}
        className="relative bg-white p-10 rounded-xl text-slate-500"
      >
        <h1 className="text-center text-2xl text-neutral-700 font-medium">
          Recruiter {state}
        </h1>
        <p className="text-sm">Welcome back! Please sign in to continue</p>
        {state == 'Sign Up' && isTextDataSubmitted ? (
          <>
            <div className="flex items-center gap-4 my-10">
              <label htmlFor="image">
                <img
                  src={image ? URL.createObjectURL(image) : assets.upload_area}
                  alt=""
                  className="w-16 h-16 object-cover rounded-full cursor-pointer"
                />
                <input
                  type="file"
                  id="image"
                  onChange={(e) => setImage(e.target.files[0])}
                  hidden
                />
              </label>
              <p>
                Upload Business <br /> logo
              </p>
            </div>
          </>
        ) : (
          <>
            {state !== 'Login' && (
              <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5 ">
                <img src={assets.person_icon} alt="" />
                <input
                  type="text"
                  placeholder="Business Name"
                  className="outline-none text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5 ">
              <img src={assets.email_icon} alt="" />
              <input
                type="email"
                placeholder="Email"
                className="outline-none text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5 ">
              <img src={assets.lock} alt="" />
              <input
                type="password"
                placeholder="Password"
                className="outline-none text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </>
        )}

        {state === 'Login' && (
          <p className="text-sm text-primary mt-4 cursor-pointer">
            Forgot password?
          </p>
        )}

        <button
          type="submit"
          className="bg-primary w-full text-white py-2 mt-4 rounded-full"
        >
          {state === 'Login'
            ? 'login'
            : isTextDataSubmitted
              ? 'create account'
              : 'next'}
        </button>

        {state === 'Login' ? (
          <p className="mt-5 text-center">
            Don't have an account?{' '}
            <span
              className="text-primary cursor-pointer"
              onClick={() => setState('Sign Up')}
            >
              Sign Up
            </span>
          </p>
        ) : (
          <p className="mt-5 text-center">
            Already have an account?{' '}
            <span
              className="text-primary cursor-pointer"
              onClick={() => setState('Login')}
            >
              Login
            </span>
          </p>
        )}

        <img
          src={assets.cross_icon}
          alt=""
          className="absolute top-5 right-5 cursor-pointer"
          onClick={() => setShowRecruiterLogin(false)}
        />
      </form>
    </div>
  );
};

export default RecruiterLogin;
