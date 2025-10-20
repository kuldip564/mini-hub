
import React from 'react';
import { BsPersonCircle } from 'react-icons/bs';
import { IoMdChatbubbles } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { followUser, unFollowUser } from '../Redux/Slices/Authslices';

// A reusable component to display a single user card.
const UserCard = ({ user, currentUser, onUserUpdate }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleToggleFollow = async () => {
    // Determine if the user is currently being followed
    const isFollowing = user.following;

    if (isFollowing) {
      // Unfollow the user
      const response = await dispatch(unFollowUser({ coruntuserId: currentUser._id, id: user._id }));
      if (response?.payload?.success) {
        // Update local state by calling the parent's update function
        onUserUpdate({ ...user, following: false });
      }
    } else {
      // Follow the user
      const response = await dispatch(followUser({ coruntuserId: currentUser._id, id: user._id }));
      if (response?.payload?.success) {
        // Update local state by calling the parent's update function
        onUserUpdate({ ...user, following: true });
      }
    }
  };
  return (
    <div
      key={user._id}
      className="bg-gray-800 flex flex-col sm:flex-row p-6 rounded-2xl shadow-xl w-full max-w-sm sm:max-w-none items-center gap-6 border border-gray-700 hover:shadow-2xl hover:border-yellow-400 transition-all duration-200 group"
    >
      <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
        {/* Profile Picture and navigate to profile */}
        <div
          onClick={() => navigate("/profile", { state: { ...user } })}
          className="cursor-pointer w-20 h-20 flex rounded-full overflow-hidden bg-black border-2 border-yellow-400 group-hover:border-yellow-500 transition-all duration-200 flex-shrink-0"
        >
          {user.profilePicture ? (
            <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <BsPersonCircle className="w-full h-full text-gray-500" />
          )}
        </div>
        
        {/* User details and actions */}
        <div className="flex-1 flex flex-col items-center sm:items-start gap-2">
          <h2 className="text-2xl font-bold text-white text-center sm:text-left">{user.name}</h2>
          {user.following ? (
            <button
              onClick={handleToggleFollow}
              className="bg-yellow-400 text-gray-900 py-2 px-6 rounded-full font-semibold transition-all duration-200 shadow hover:bg-yellow-500 active:scale-95"
            >
              Following
            </button>
          ) : (
            <button
              onClick={handleToggleFollow}
              className="bg-gray-700 text-yellow-400 py-2 px-6 rounded-full font-semibold transition-all duration-200 shadow border border-yellow-400 hover:bg-gray-600 active:scale-95"
            >
              Add Friend
            </button>
          )}
        </div>
      </div>

      {/* Chat button */}
      {user.following && (
        <div className="sm:ml-auto">
          <IoMdChatbubbles className="text-4xl text-yellow-400 cursor-pointer hover:text-yellow-500 active:scale-95 transition-all duration-200" />
        </div>
      )}
    </div>
  );
};

export default UserCard;