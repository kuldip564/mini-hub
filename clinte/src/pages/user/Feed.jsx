import { useEffect, useState } from 'react';
import HomeLayout from '../../layout/HomeLayout';
import { useDispatch, useSelector } from 'react-redux';
import { allPost, getUserData } from '../../Redux/Slices/Authslices';
import Post from '../coursePage/Post';


const Feed = () => {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state?.auth?.data);

    const [data, setData] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchInitialData() {
            try {
                // Fetch user data first
                await dispatch(getUserData());

                // Then fetch all posts
                setLoading(true);
                const response = await dispatch(allPost());
                const followedUsers = response?.payload?.data?.followedUsers || [];
                setUsers(followedUsers);

                const allPosts = followedUsers
                    .filter(user => Array.isArray(user.post) && user.post.length > 0)
                    .flatMap(user =>
                        user.post.map(postItem => ({
                            ...postItem,
                            user: {
                                id: user._id,
                                name: user.name,
                                avatar: user.avatar,
                                username: user.name.toLowerCase().replace(/\s+/g, '')
                            }
                        }))
                    );

                setData(allPosts);
            } catch (error) {
                console.error('Failed to fetch initial data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchInitialData();
    }, [dispatch]);

    const handleUpdatePost = (updatedPost) => {
        setData(prevData =>
            prevData.map(post =>
                post._id === updatedPost._id ? updatedPost : post
            )
        );
    };

    const currentUser = userData && userData.name ? {
        name: userData.name,
        username: userData.email ? userData.email.split('@')[0] : 'username',
        avatar: userData.avatar?.secureUrl || '/default-avatar.png',
    } : {
        name: 'Loading...',
        username: 'username',
        avatar: '/default-avatar.png',
    };

    return (
        <HomeLayout>
            <div className="w-full min-h-screen flex justify-center bg-gradient-to-b from-gray-900 to-gray-800 py-10">
                {/* Sidebar */}
                <aside className="hidden md:flex flex-col gap-6 max-w-xs w-full fixed left-0 top-0 pt-10 pl-6 z-10">
                    <div className="bg-white/90 rounded-xl shadow p-6 flex items-center gap-4">
                        <img className="w-14 h-14 rounded-full border-2 border-yellow-400 object-cover" src={currentUser.avatar} alt="Avatar" />
                        <div>
                            <div className="font-semibold text-gray-900 truncate max-w-[120px]">{currentUser.name}</div>
                            <div className="text-gray-500 text-sm truncate max-w-[120px]">@{currentUser.username}</div>
                        </div>
                    </div>
                    <div className="bg-white/90 rounded-xl shadow p-6">
                        <div className="font-semibold text-yellow-500 mb-2">Suggestions</div>
                        <ul className="flex flex-col gap-2">
                            {users.length === 0 && <li className="text-gray-400">No suggestions</li>}
                            {users.slice(0, 5).map((user) => (
                                <li key={user._id} className="flex items-center gap-3 text-gray-800 hover:text-yellow-500 cursor-pointer transition rounded-lg px-2 py-1">
                                    <img className="w-10 h-10 rounded-full border-2 border-yellow-400 object-cover" src={user.avatar?.secureUrl || '/default-avatar.png'} alt="Avatar" />
                                    <span className="font-semibold truncate max-w-[100px]">@{user.name ? user.name.toLowerCase().replace(/\s+/g, '') : 'user'}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* Feed */}
                <div className="w-full max-w-xl px-4 flex flex-col gap-8 md:ml-[28vw]">
                    {loading ? (
                        <div className="text-gray-400 text-center mt-20 text-lg">Loading...</div>
                    ) : data.length > 0 ? (
                        data.map((item, index) => (
                            <Post
                                key={index}
                                post={item}
                                userData={userData}
                                onUpdatePost={handleUpdatePost}
                            />
                        ))
                    ) : (
                        <div className="text-gray-400 text-center mt-20 text-lg">No posts to show</div>
                    )}
                </div>
            </div>
        </HomeLayout>
    );
};

export default Feed;