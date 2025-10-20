import React from 'react'
import { FiMenu } from 'react-icons/fi'
import { AiFillCloseCircle } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import Footer from '../componet/Footor';
import { logout } from '../Redux/Slices/Authslices';

const HomeLayout = ({ children }) => {
    const dispatch = useDispatch();
    const navigate = useDispatch();
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const role = useSelector((state) => state.auth.role);

    function chengWidth() {
        const drawer = document.querySelector('.drawer-side');
        drawer[0].style.width = 0;
    }
    function hideDrawer() {
        const elment = document.querySelector('.drawer-toggle');
        elment.checked = false;
        chengWidth();
    }

    async function hendalLogout(e) {
        e.preventDefault();
        try {
            const response = await dispatch(logout());
            console.log("Logout response:", response);
    
            if (response?.payload?.success) {
                toast.success("Logged out successfully");
                navigate('/');
            }
        } catch (error) {
            console.error("Logout error:", error);
        }
    }
    return (
        <div className="min-h-[90vh] bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900">
            <div className="drawer absolute left-0 z-50">
                <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    <label htmlFor="my-drawer" className="cursor-pointer relative">
                        <FiMenu
                            onClick={chengWidth}
                            size={"32px"}
                            className="font-bold text-yellow-400 m-4 hover:text-yellow-300 transition-all duration-200 drop-shadow-lg"
                        />
                    </label>
                </div>
                <div className="drawer-side ">
                    <label htmlFor="my-drawer" className="drawer-overlay"></label>
                    <ul className="menu p-6 gap-6 w-56 sm:w-80 bg-white/10 backdrop-blur-lg border-r border-gray-700 text-base-content relative rounded-r-2xl shadow-2xl mt-2">
                        <li className="w-fit absolute right-2 z-50">
                            <button onClick={hideDrawer} className="hover:scale-110 transition-all duration-200">
                                <AiFillCloseCircle className="text-3xl text-yellow-400 hover:text-yellow-500" />
                            </button>
                        </li>
                        <li className="mt-14 text-lg font-semibold text-gray-100 hover:text-yellow-400 transition-all duration-200"><Link to='/'>Home</Link></li>
                        <li className="text-lg font-semibold text-gray-100 hover:text-yellow-400 transition-all duration-200"><Link to='/feed'>Feed</Link></li>
                        <li className="text-lg font-semibold text-gray-100 hover:text-yellow-400 transition-all duration-200"><Link to="/search">Search</Link></li>
                        {isLoggedIn && role === 'ADMIN' && (
                            <li>
                                <Link className="text-lg font-semibold text-gray-100 hover:text-yellow-400 transition-all duration-200" to="/admin/dashboard">
                                    Admin Dashboard
                                </Link>
                            </li>
                        )}
                        {isLoggedIn && role === 'ADMIN' && (
                            <li>
                                <Link className="text-lg font-semibold text-gray-100 hover:text-yellow-400 transition-all duration-200" to="/course/create">
                                    Create Course
                                </Link>
                            </li>
                        )}
                        <li><Link className="text-lg font-semibold text-gray-100 hover:text-yellow-400 transition-all duration-200" to="/allCourse">All courses</Link></li>
                        <li><Link className="text-lg font-semibold text-gray-100 hover:text-yellow-400 transition-all duration-200" to="/contact">Contact Us</Link></li>
                        <li><Link className="text-lg font-semibold text-gray-100 hover:text-yellow-400 transition-all duration-200" to="/about">About</Link></li>

                        {!isLoggedIn && (
                            <div className="flex w-full gap-2 justify-center items-center mt-8">
                                <Link to="/login" className="px-5 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-full shadow hover:bg-yellow-500 transition-all duration-200 text-center">Login</Link>
                                <Link to="/signup" className="px-5 py-2 bg-gray-800 text-yellow-400 font-semibold rounded-full shadow hover:bg-gray-700 hover:text-yellow-300 transition-all duration-200 text-center">Signup</Link>
                            </div>
                        )}
                        {isLoggedIn && (
                            <div className="flex w-full gap-2 justify-center items-center mt-8">
                                <Link to="/user/profile" className="px-5 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-full shadow hover:bg-yellow-500 transition-all duration-200 text-center">Profile</Link>
                                <Link onClick={hendalLogout} className="px-5 py-2 bg-gray-800 text-yellow-400 font-semibold rounded-full shadow hover:bg-gray-700 hover:text-yellow-300 transition-all duration-200 text-center">Logout</Link>
                            </div>
                        )}
                    </ul>
                </div>
            </div>

            <div className=" pb-8 min-h-[80vh]">{children}</div>
            <Footer />
        </div>
    )
}

export default HomeLayout