import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData, findUsers, userFindbySearching } from "../../Redux/Slices/Authslices";
import HomeLayout from '../../layout/HomeLayout';
import { FiSearch } from 'react-icons/fi';
import UserCard from '../../componet/UserCard';

const Search = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state?.auth?.data);
  const [allUsers, setAllUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const timeoutRef = useRef();

  // Fetch logged-in user data
  const fetchUserData = async () => {
    try {
      await dispatch(getUserData());
    } catch (error) {
      console.error("Failed to fetch user data");
    }
  };

  // Fetch all users and mark following status
  const fetchAllUsers = async () => {
    try {
      const data = await dispatch(findUsers());
      
      if (data?.payload?.userditel) {
        const users = data.payload.userditel.map((item) => ({
          name: item.name,
          email: item.email,
          profilePicture: item.avatar|| '',
          _id: item._id,
          post: item.post || [],
          following: userData?.following?.includes(item._id) || false,
          followingd: userData.following,
          followers: item.followers || [],
        }));
        setAllUsers(users);
        setDisplayedUsers(users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchUserData();
  }, []);

  // Fetch users list only after userData is available
  useEffect(() => {
    if (userData && userData._id) {
      fetchAllUsers();
    }
  }, [userData]);

  // Search API call with debounce
  const handleSearch = async (value) => {
    setSearchTerm(value);
    clearTimeout(timeoutRef.current);

    if (value.trim() === '') {
      // If search term is empty, display all users
      setDisplayedUsers(allUsers);
      return;
    }
    
    // Debounce the search call
    timeoutRef.current = setTimeout(async () => {
      try {
        const data = await dispatch(userFindbySearching(value));
        if (data?.payload) {
          const searchResults = data.payload.map((item) => ({
            name: item.name,
            email: item.email,
            profilePicture: item.avatar || '',
            _id: item._id,
            post: item.post || [],
            following: userData?.following?.includes(item._id) || false,
            followers: item.followers || [],
          }));
          setDisplayedUsers(searchResults);
        }
      } catch (error) {
        console.error('Failed to search users:', error);
      }
    }, 500); // 500ms debounce
  };

  // Function to update user state after follow/unfollow action
  const handleUserUpdate = (updatedUser) => {
    const updateUserList = (list) =>
      list.map((u) => (u._id === updatedUser._id ? updatedUser : u));
    
    // Update both the main list and the displayed list
    setAllUsers((prev) => updateUserList(prev));
    setDisplayedUsers((prev) => updateUserList(prev));
  };

  return (
    <HomeLayout>
      <div className="min-h-screen pt-12 flex flex-col bg-gray-900 gap-10 items-center px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 w-full max-w-xl">
          <div className="relative w-full">
            <input
              placeholder="Search users..."
              type="search"
              className="py-3 pl-12 pr-4 rounded-full w-full bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-yellow-400 transition-all duration-200 shadow-lg placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          </div>
        </div>

        {loading ? (
          <div className="text-yellow-400 mt-10 text-lg font-semibold">Loading users...</div>
        ) : (
          <div className="mb-10 w-full flex flex-wrap gap-6 justify-center max-w-4xl">
            {displayedUsers.length > 0 ? (
              displayedUsers.map((user) => (
                <UserCard key={user._id} user={user} currentUser={userData} onUserUpdate={handleUserUpdate} />
              ))
            ) : (
              <div className="text-gray-400 mt-10 text-lg">No users found.</div>
            )}
          </div>
        )}
      </div>
    </HomeLayout>
  );
};

export default Search;

