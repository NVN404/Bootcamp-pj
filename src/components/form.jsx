import * as React from 'react';
import { useState } from 'react';
import axios from 'axios';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

export default function Form() { // No props needed
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        console.log('Login attempt:', { email, password });
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          email,
          password,
        });
        console.log('Login response:', response.data);
        const { user } = response.data; // No token since JWT is removed

        window.localStorage.setItem('loggedIn', 'true');
        window.localStorage.setItem('userType', 'User'); // Hardcoded
        // Removed setUser(user) and setAuthState('loggedIn')

        setSuccess('Login successful!');
        console.log('localStorage after login:', window.localStorage.getItem('loggedIn'));

        navigate('/specialist');
      } else {
        console.log('Signup attempt:', { email, password });
        const response = await axios.post('http://localhost:5000/api/auth/signup', {
          email,
          password,
        });
        console.log('Signup response:', response.data);
        setSuccess(response.data.message);
        setIsLogin(true);
      }
    } catch (err) {
      console.error('Login error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div>
      <div className="mx-60 w-11/12 max-w-[700px] px-20 py-20 rounded-3xl border-2 border-brightRed bb-10">
        <h1 className="text-5xl font-semibold">
          {isLogin ? 'Welcome Back' : 'Create an Account'}
        </h1>
        <p className="font-medium text-lg text-gray-500 mt-4">
          {isLogin ? 'Welcome back! Please enter your details.' : 'Sign up to get started!'}
        </p>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">{success}</p>}
        <form onSubmit={handleSubmit} className="mt-8">
          <div className="flex flex-col">
            <label className="text-lg font-medium">Email</label>
            <input
              className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="text-lg font-medium">Password</label>
            <input
              className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {isLogin && (
            <div className="mt-8 flex justify-between items-center">
              <div>
                <input type="checkbox" id="remember" />
                <label className="ml-2 font-medium text-base" htmlFor="remember">
                  Remember for 30 days
                </label>
              </div>
              <button type="button" className="font-medium text-base text-violet-500">
                Forgot password
              </button>
            </div>
          )}
          <div className="mt-8 flex flex-col gap-y-4">
            <button
              type="submit"
              className="active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out transform py-4 bg-brightRed rounded-xl text-white font-bold text-lg"
            >
              {isLogin ? 'Sign in' : 'Sign up'}
            </button>
          </div>
          <div className="mt-8 flex justify-center items-center">
            <p className="font-medium text-base">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </p>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 font-medium text-base text-violet-500"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}