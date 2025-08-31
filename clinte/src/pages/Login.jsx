import React, { useState } from 'react';
import { BsPersonCircle } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';

import HomeLayout from '../layout/HomeLayout';
import { login } from '../Redux/Slices/Authslices';

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    function handleUserData(e) {
        const { name, value } = e.target;
        setLoginData(prev => ({ ...prev, [name]: value }));
    }

    async function onLogin(event) {
        event.preventDefault();
        const { email, password } = loginData
        if (!email || !password) {
            toast.error("Please fill in all details");
            return;
        }

        try {
            const response = await dispatch(login(loginData));
            if (response?.payload?.success) {
                navigate('/');
            }
            setLoginData({
                email: "",
                password: "",
            });
        } catch (err) {
            console.error("Signup failed:", err);
        }
    }

    return (
        <HomeLayout>
            <div className="flex justify-center items-center min-h-[90vh] bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900">
                <form onSubmit={onLogin} noValidate className="flex flex-col justify-center gap-6 rounded-2xl p-10 w-full max-w-md bg-white/10 backdrop-blur-lg border border-gray-700 shadow-2xl">
                    <div className="flex flex-col items-center gap-2 mb-2">
                        <BsPersonCircle className="text-6xl text-yellow-400 drop-shadow mb-2" />
                        <h1 className="text-3xl font-extrabold text-gray-100 tracking-tight">Login</h1>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-gray-200 font-semibold">Email</label>
                        <input
                            required
                            type="email"
                            name='email'
                            id='email'
                            placeholder='Enter your email...'
                            className="py-2 px-4 rounded-lg border border-gray-700 bg-gray-900 text-gray-100 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all duration-200 placeholder-gray-400"
                            onChange={handleUserData}
                            value={loginData.email}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className="text-gray-200 font-semibold">Password</label>
                        <input
                            required
                            type="password"
                            name='password'
                            id='password'
                            placeholder='Enter your password...'
                            className="py-2 px-4 rounded-lg border border-gray-700 bg-gray-900 text-gray-100 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all duration-200 placeholder-gray-400"
                            onChange={handleUserData}
                            value={loginData.password}
                        />
                    </div>
                    <button type='submit' className="mt-2 cursor-pointer bg-yellow-400 hover:bg-yellow-500 transition-all duration-200 py-3 capitalize rounded-full font-bold text-lg text-gray-900 shadow-lg">
                        Login
                    </button>
                    <p className="text-center text-gray-300">
                        Don&apos;t have an account?{' '}
                        <Link to='/signup' className="text-yellow-400 font-semibold hover:underline">Signup</Link>
                    </p>
                </form>
            </div>
        </HomeLayout>
    );
};

export default LoginPage;
