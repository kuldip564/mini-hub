import React, { useState } from 'react';
import { BsPersonCircle } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';

import HomeLayout from '../layout/HomeLayout';
import { createAccount } from '../Redux/Slices/Authslices';

const SignupPage = () => {
    const [userImg, setUserImg] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [signupData, setSignupData] = useState({
        fullName: "",
        email: "",
        password: "",
        avatar: ""
    });
    const [focus, setFocus] = useState({ fullName: false, email: false, password: false });

    function handleUserData(e) {
        const { name, value } = e.target;
        setSignupData(prev => ({ ...prev, [name]: value }));
    }

    function getImg(e) {
        const uploadedImage = e.target.files[0];
        if (uploadedImage) {
            setSignupData(prev => ({ ...prev, avatar: uploadedImage }));
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.onload = () => {
                setUserImg(fileReader.result);
            };
        }
    }

    async function createNewAccount(event) {
        event.preventDefault();

        const { fullName, email, password, avatar } = signupData;

        // Input validations
        if (!fullName || !email || !password || !avatar) {
            toast.error("Please fill in all details");
            return;
        }
        if (fullName.length < 6) {
            toast.error("Name must be at least 6 characters");
            return;
        }
        if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
            toast.error("Enter a valid email");
            return;
        }
        if (
            !password.match(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            )
        ) {
            toast.error(
                "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
            );
            return;
        }

        const formData = new FormData();
        formData.append("name", fullName);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("avatar", avatar);

        try {
            const response = await dispatch(createAccount(formData));
            if (response?.payload?.success) {
                navigate('/');
            }
            setSignupData({
                fullName: "",
                email: "",
                password: "",
                avatar: ""
            });
            setUserImg('');
        } catch (err) {
            console.error("Signup failed:", err);
        }
    }

    // Helper for floating label: always float if focused or has value
    const floatLabel = (field) => (focus[field] || signupData[field]) ? 'text-xs -top-3.5 left-3 bg-gray-900 px-1' : 'text-base top-2 left-4';

    return (
        <HomeLayout>
            <div className="flex justify-center items-center min-h-[90vh] bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900">
                <form
                    onSubmit={createNewAccount}
                    noValidate
                    className="flex flex-col justify-center gap-8 rounded-2xl p-10 w-full max-w-md bg-white/10 backdrop-blur-lg border-2 border-transparent shadow-2xl animate-fade-in-up relative group transition-all duration-300 hover:shadow-yellow-400/30 hover:border-yellow-400 before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-tr before:from-yellow-400 before:via-yellow-200 before:to-yellow-500 before:opacity-0 group-hover:before:opacity-40 before:transition-all before:duration-300 overflow-hidden"
                >
                    <div className="flex flex-col items-center gap-2 mb-2 z-10">
                        <label htmlFor="image_uploads" className="cursor-pointer group/avatar">
                            {userImg ? (
                                <img className="w-24 h-24 rounded-full m-auto border-4 border-yellow-400 shadow-lg object-cover group-hover/avatar:scale-105 transition-all duration-200" src={userImg} />
                            ) : (
                                <BsPersonCircle className="w-24 h-24 rounded-full m-auto text-yellow-400 group-hover/avatar:scale-105 transition-all duration-200" />
                            )}
                        </label>
                        <input
                            type="file"
                            className="hidden"
                            id="image_uploads"
                            name="image_uploads"
                            onChange={getImg}
                            accept='.jpg,.jpeg,.png,.svg'
                        />
                        <h1 className="text-3xl font-extrabold text-gray-100 tracking-tight mt-2">Registration</h1>
                    </div>
                    <div className="flex flex-col gap-6 z-10">
                        {/* Name */}
                        <div className="relative">
                            <input
                                required
                                type="text"
                                name='fullName'
                                id='fullName'
                                autoComplete="off"
                                placeholder=' '
                                className="peer py-2 px-4 rounded-lg border border-gray-700 bg-gray-900 text-gray-100 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all duration-200 placeholder-transparent w-full"
                                onChange={handleUserData}
                                value={signupData.fullName}
                                onFocus={() => setFocus(f => ({ ...f, fullName: true }))}
                                onBlur={() => setFocus(f => ({ ...f, fullName: false }))}
                                aria-label="Full Name"
                            />
                            <label
                                htmlFor="fullName"
                                className={`absolute pointer-events-none transition-all duration-200 text-gray-400 font-semibold bg-transparent px-1 ${floatLabel('fullName')}`}
                            >
                                Name
                            </label>
                        </div>
                        {/* Email */}
                        <div className="relative">
                            <input
                                required
                                type="email"
                                name='email'
                                id='email'
                                autoComplete="off"
                                placeholder=' '
                                className="peer py-2 px-4 rounded-lg border border-gray-700 bg-gray-900 text-gray-100 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all duration-200 placeholder-transparent w-full"
                                onChange={handleUserData}
                                value={signupData.email}
                                onFocus={() => setFocus(f => ({ ...f, email: true }))}
                                onBlur={() => setFocus(f => ({ ...f, email: false }))}
                                aria-label="Email"
                            />
                            <label
                                htmlFor="email"
                                className={`absolute pointer-events-none transition-all duration-200 text-gray-400 font-semibold bg-transparent px-1 ${floatLabel('email')}`}
                            >
                                Email
                            </label>
                        </div>
                        {/* Password */}
                        <div className="relative">
                            <input
                                required
                                type="password"
                                name='password'
                                id='password'
                                autoComplete="off"
                                placeholder=' '
                                className="peer py-2 px-4 rounded-lg border border-gray-700 bg-gray-900 text-gray-100 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all duration-200 placeholder-transparent w-full"
                                onChange={handleUserData}
                                value={signupData.password}
                                onFocus={() => setFocus(f => ({ ...f, password: true }))}
                                onBlur={() => setFocus(f => ({ ...f, password: false }))}
                                aria-label="Password"
                            />
                            <label
                                htmlFor="password"
                                className={`absolute pointer-events-none transition-all duration-200 text-gray-400 font-semibold bg-transparent px-1 ${floatLabel('password')}`}
                            >
                                Password
                            </label>
                        </div>
                    </div>
                    <button type='submit' className="mt-2 cursor-pointer bg-yellow-400 hover:bg-yellow-500 transition-all duration-200 py-3 capitalize rounded-full font-bold text-lg text-gray-900 shadow-lg z-10">
                        Create Account
                    </button>
                    <p className="text-center text-gray-300 z-10">
                        Already have an account?{' '}
                        <Link to='/login' className="text-yellow-400 font-semibold hover:underline">Login</Link>
                    </p>
                </form>
            </div>
        </HomeLayout>
    );
};

export default SignupPage;