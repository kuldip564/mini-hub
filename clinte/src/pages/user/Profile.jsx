import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import HomeLayout from "../../layout/HomeLayout";
import { getUserData } from "../../Redux/Slices/Authslices";

function Profile() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [big, setBig] = useState(false);
    const [selectedImg, setSelectedImg] = useState(null);
    const userData = useSelector((state) => state?.auth?.data);
    // console.log(userData.post);
    console.log(userData,"this data");
    

    async function handleCancellation() {
        toast("Initiating cancellation");
        await dispatch(cancelCourseBundle());
        await dispatch(getUserData());
        toast.success("Cancellation completed!");
        navigate("/");
    }
    const bigscren = (data) => {
        setSelectedImg(data);
        setBig(true);
    };
    const closeModal = () => {
        setBig(false);
        setSelectedImg(null);
    };
    async function fetchUserData() {
        try {
            const data = await dispatch(getUserData());
        } catch (error) {
            toast.error("Failed to fetch user data");
        }
    }
    useEffect(() => {
        fetchUserData();
    }, []);
    return (
        <HomeLayout>
            {big ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all duration-300">
                    <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl p-4 md:p-8 max-w-2xl w-[90vw] flex flex-col items-center border-2 border-yellow-400 animate-scaleIn">
                        <button
                            onClick={closeModal}
                            className="absolute top-3 right-3 text-yellow-400 bg-gray-800 hover:bg-yellow-400 hover:text-gray-900 rounded-full p-2 text-2xl font-bold focus:outline-none shadow-lg transition-all duration-200 border-2 border-yellow-400"
                            aria-label="Close"
                        >
                            &times;
                        </button>
                        <img
                            src={selectedImg?.secureUrl}
                            alt="Post Preview"
                            className="max-h-[65vh] w-auto rounded-2xl border-4 border-yellow-400 shadow-2xl object-contain transition-all duration-300"
                        />
                    </div>
                    <style>{`
                        @keyframes scaleIn {
                          0% { transform: scale(0.8); opacity: 0; }
                          100% { transform: scale(1); opacity: 1; }
                        }
                        .animate-scaleIn {
                          animation: scaleIn 0.3s cubic-bezier(0.4,0,0.2,1);
                        }
                    `}</style>
                </div>
            ) : (
                <div className="min-h-[90vh] w-full flex items-center justify-center bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900">
                    <div className="my-10 flex flex-col gap-6 rounded-2xl p-10 bg-white/10 backdrop-blur-lg border border-gray-700 shadow-2xl items-center">
                        <div className="bg-gradient-to-tr from-yellow-400 via-yellow-500 to-yellow-600 p-1 rounded-full mb-4">
                            <img
                                src={userData?.avatar?.secureUrl || '/default-avatar.png'}
                                className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg"
                                alt="Profile"
                            />
                        </div>
                        <h3 className="text-3xl font-extrabold text-gray-100 mb-2 tracking-tight text-center capitalize">
                            {userData?.name || 'Username'}
                        </h3>
                        <div className="flex justify-center gap-10 w-full mb-4">
                            <div className="text-center">
                                <span className="block text-xl font-bold text-yellow-400">{userData?.following?.length || 0}</span>
                                <span className="text-gray-300 text-sm">Following</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-xl font-bold text-yellow-400">{userData?.followers?.length || 0}</span>
                                <span className="text-gray-300 text-sm">Followers</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 w-full text-gray-200 text-base mb-4">
                            <p className="font-semibold">Email:</p><p className="truncate">{userData?.email}</p>
                            <p className="font-semibold">Role:</p><p className="capitalize">{userData?.role}</p>
                        </div>
                        <div className="flex items-center justify-between gap-4 w-full">
                            <Link
                                to="/user/editprofile"
                                className="w-1/2 bg-gray-800 hover:bg-gray-700 transition-all duration-200 rounded-full font-semibold py-2 cursor-pointer text-center text-yellow-400 shadow"
                            >
                                Edit profile
                            </Link>
                            <Link
                                to="/addPost"
                                className="w-1/2 bg-gray-800 hover:bg-gray-700 transition-all duration-200 rounded-full font-semibold py-2 cursor-pointer text-center text-yellow-400 shadow"
                            >
                                Add Post
                            </Link>
                        </div>
                        {userData?.subscription?.status === "active" && (
                            <button onClick={handleCancellation} className="w-full bg-red-600 hover:bg-red-500 transition-all duration-200 rounded-full font-semibold py-2 cursor-pointer text-center text-white shadow mt-4">
                                Cancel Subscription
                            </button>
                        )}
                        <div className='w-full min-h-[70vh]'>
                            <div className="flex justify-center gap-12 mb-4">
                                <Link className='bg-yellow-500 py-2 px-5 text-white rounded-lg active:bg-yellow-500 active:py-1.5 ml3 hover:bg-yellow-600'>Post</Link>
                                <Link className='bg-yellow-500 py-2 px-5 text-white rounded-lg active:bg-yellow-500 active:py-1.5 ml3 hover:bg-yellow-600'>Reels</Link>
                                <Link className='bg-yellow-500 py-2 px-5 text-white rounded-lg active:bg-yellow-500 active:py-1.5 ml3 hover:bg-yellow-600'>Saved</Link>
                            </div>
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                                {userData?.post?.map((item) => (
                                    <div
                                        onClick={() => bigscren(item.Post)}
                                        key={item.Post.secureUrl}
                                        className='h-[30vh] w-[15vw] overflow-hidden rounded-lg border border-yellow-500 cursor-pointer hover:scale-105 transition-transform duration-200 shadow-lg bg-gray-900 flex items-center justify-center'
                                    >
                                        <img
                                            src={item.Post.secureUrl}
                                            alt="img"
                                            className='w-full h-full object-cover rounded-lg'
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </HomeLayout>
    );
}

export default Profile;