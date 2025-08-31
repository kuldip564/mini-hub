import React, { useEffect, useState } from 'react'
import HomeLayout from '../../layout/HomeLayout'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { followUser, getUserData, unFollowUser, likePost, commentPost } from '../../Redux/Slices/Authslices'
import { BiLike, BiMessage } from "react-icons/bi";
import { FiX } from "react-icons/fi";
import Listfollowing from '../../componet/Listfollowing'


const CommentsModal = ({ comments, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md transition-all duration-300">
      <div className="relative bg-gray-900 rounded-3xl shadow-2xl p-6 md:p-8 max-w-lg w-[90vw] h-[80vh] flex flex-col border-2 border-yellow-400 animate-scaleIn">
        <div className="flex justify-between items-center border-b pb-4 mb-4 border-gray-700">
          <h3 className="text-2xl font-bold text-white">Comments</h3>
          <button
            onClick={onClose}
            className="text-yellow-400 bg-gray-800 hover:bg-yellow-400 hover:text-gray-900 rounded-full p-2 text-2xl font-bold focus:outline-none shadow-lg transition-all duration-200 border-2 border-yellow-400"
            aria-label="Close"
          >
            <FiX />
          </button>
        </div>
        <div className='flex-1 overflow-y-auto custom-scrollbar pr-2'>
          {comments?.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className='bg-gray-800 p-3 rounded-lg mb-3'>
                <p className='text-white font-semibold'>
                  <span className='text-yellow-400 mr-2'>@{comment.user?.name || 'user'}</span>
                  <span className='text-gray-300'>{comment.comment}</span>
                </p>
              </div>
            ))
          ) : (
            <p className='text-gray-400 text-center text-lg mt-10'>No comments yet.</p>
          )}
        </div>
      </div>
      <style>{`
            @keyframes scaleIn {
              0% { transform: scale(0.8); opacity: 0; }
              100% { transform: scale(1); opacity: 1; }
            }
            .animate-scaleIn {
              animation: scaleIn 0.3s cubic-bezier(0.4,0,0.2,1);
            }
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #4B5563;
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #FBBF24;
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #F59E0B;
            }
          `}</style>
    </div>
  );
};

const Followinguser = () => {
  const { state } = useLocation()
  const userData = state || {}
  const loginuser = useSelector((state) => state?.auth?.data)
  const dispatch = useDispatch()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null)
  const [loading, setLoading] = useState(true);
  const [commentInput, setCommentInput] = useState('');
  console.log(state);
  
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        await dispatch(getUserData());
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [dispatch]);

  const isFollowing = loginuser?.following?.includes(userData?._id);

  const handleToggleFollow = async () => {
    if (!loginuser || !loginuser._id || !userData._id) return;
    try {
      let response;
      if (isFollowing) {
        response = await dispatch(unFollowUser({ coruntuserId: loginuser._id, id: userData._id }));
      } else {
        response = await dispatch(followUser({ coruntuserId: loginuser._id, id: userData._id }));
      }
      if (response?.payload?.success) {
        await dispatch(getUserData());
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  }

  const openModal = (post) => {
    setSelectedPost(post)
    setIsModalOpen(true)
  }
  
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedPost(null)
  }

  const openCommentsModal = () => {
    setIsCommentsModalOpen(true);
  };

  const closeCommentsModal = () => {
    setIsCommentsModalOpen(false);
  };

  const openFollowingModal = () => {
    setIsFollowingModalOpen(true);
  };

  const closeFollowingModal = () => {
    setIsFollowingModalOpen(false);
  };


  const handleLikePost = async (post) => {
    const postId = post._id;
    const postUserId = userData._id; 
    try {
      const response = await dispatch(likePost({ postId, postUserId }));
      if (response?.payload?.success) {
        setSelectedPost(prevPost => {
          const hasLiked = prevPost.like?.includes(loginuser._id);
          const updatedLikes = hasLiked
            ? prevPost.like.filter(id => id !== loginuser._id)
            : [...(prevPost.like || []), loginuser._id];
          return { ...prevPost, like: updatedLikes };
        });
        await dispatch(getUserData());
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const handleCommentPost = async (e, post) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    const postId = post._id;
    const postUserId = userData._id;
    try {
      const response = await dispatch(commentPost({ postId, postUserId, comment: commentInput }));
      if (response?.payload?.success) {
        setSelectedPost(prevPost => {
          const newComment = { comment: commentInput, user: { name: loginuser.name } };
          console.log(post,"this post");
          
          return { ...prevPost, comments: [...(prevPost.commentData || []), newComment] };
        });
        setCommentInput('');
        await dispatch(getUserData());
      }
    } catch (error) {
      console.error("Failed to comment on post:", error);
    }
  };
  
  return (
    <HomeLayout>
      {/* Post Preview Modal */}
      {isModalOpen && selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all duration-300">
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl p-4 md:p-8 max-w-2xl w-[90vw] flex flex-col items-center border-2 border-yellow-400 animate-scaleIn">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-yellow-400 bg-gray-800 hover:bg-yellow-400 hover:text-gray-900 rounded-full p-2 text-2xl font-bold focus:outline-none shadow-lg transition-all duration-200 border-2 border-yellow-400"
              aria-label="Close"
              >
              <FiX />
            </button>
            <img
              src={selectedPost?.Post?.secureUrl}
              alt="Post Preview"
              className="max-h-[65vh] w-auto rounded-2xl border-4 border-yellow-400 shadow-2xl object-contain transition-all duration-300"
              />
            
            {/* Likes and Comments section */}
            <div className='w-full mt-5 px-4'>
              <div className='flex items-center justify-between text-white text-2xl'>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleLikePost(selectedPost)}
                    className={`flex items-center transition-transform hover:scale-110 ${selectedPost.like?.includes(loginuser._id) ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}`}
                    >
                    <BiLike className='mr-2' />
                    <span className='text-lg font-semibold'>{selectedPost.like?.length || 0}</span>
                  </button>
                  <div className='flex items-center text-gray-400'>
                    <BiMessage className='mr-2' />
                    <span className='text-lg font-semibold'>{selectedPost.comments?.length || 0}</span>
                  </div>
                </div>
                
                {selectedPost.comments?.length > 0 && (
                  <button
                    onClick={openCommentsModal}
                    className="text-yellow-400 text-sm font-semibold hover:underline transition-colors duration-200"
                  >
                    View all {selectedPost.comments.length} comments
                  </button>
                )}
              </div>
              
              {/* Comment list preview */}
              <div className='mt-4 max-h-24 overflow-y-hidden pr-2'>
                {selectedPost.comments?.slice(0, 2).map((comment, index) => (
                  <p key={index} className='text-gray-300 text-sm mb-1'>
                    <span className='font-semibold text-white mr-1'>@{comment.user?.name || 'user'}</span>
                    {comment.comment}
                  </p>
                ))}
              </div>

              {/* Comment input form */console.log(selectedPost,"this select post")
              }
              <form onSubmit={(e) => handleCommentPost(e, selectedPost)} className='mt-4'>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full px-4 py-2 rounded-full bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                  />
                  <button
                    type="submit"
                    className="py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-full font-semibold transition-colors duration-200"
                  >
                    Post
                  </button>
                </div>
              </form>
            </div>
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
      )}

      {/* Full Comments Modal */
      }
      {isCommentsModalOpen && selectedPost && (
        <CommentsModal comments={selectedPost.comments} onClose={closeCommentsModal} />

      )}

      {/* Main Profile Content */}
      <div className="min-h-screen pt-12 pb-12 flex flex-col bg-gray-900">
        <div className="w-full max-w-4xl mx-auto bg-gray-800 rounded-2xl p-6 sm:p-10 shadow-2xl flex flex-col items-center border border-gray-700">
          
          {/* Profile Header */}
          <div className="flex flex-col items-center mb-8 w-full">
            <div className="bg-gradient-to-tr from-yellow-400 via-yellow-500 to-yellow-600 p-1 rounded-full mb-4">
              <img
                src={userData?.profilePicture || '/default-avatar.png'}
                className="w-36 h-36 rounded-full object-cover border-4 border-gray-800 shadow-lg"
                alt="Profile"
              />
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
              {userData?.name || 'Username'}
            </h2>

            {/* Follow/Unfollow Button */}
            {loginuser?._id !== userData?._id && (
              <button
                onClick={handleToggleFollow}
                className={`py-2 px-6 rounded-full font-semibold transition-all duration-200 shadow active:scale-95
                  ${isFollowing 
                    ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500' 
                    : 'bg-gray-700 text-yellow-400 border border-yellow-400 hover:bg-gray-600'
                  }`}
              >
                {isFollowing ? 'Following' : 'Add Friend'}
              </button>
            )}
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-8 w-full max-w-md mb-8">
            <div className="text-center p-2 rounded-lg bg-gray-700/50">
              <span className="block text-2xl font-bold text-yellow-400">{userData?.post?.length || 0}</span>
              <span className="text-white text-base">Posts</span>
            </div>
            <div className="text-center p-2 rounded-lg bg-gray-700/50">
              <span className="block text-2xl font-bold text-yellow-400">{userData?.followers?.length || 0}</span>
              <span className="text-white text-base">Followers</span>
            </div>
            <div 
              className="text-center p-2 rounded-lg bg-gray-700/50 cursor-pointer transition-all duration-200 hover:bg-gray-700"
              onClick={openFollowingModal}
            >
              <span className="block text-2xl font-bold text-yellow-400">{userData?.followingd?.length || 0}</span>
              <span className="text-white text-base">Following</span>
            </div>
          </div>
          {/* Content Gallery */}
          <div className='w-full min-h-[10vh] mt-4'>
            {/* Gallery Tabs (currently static) */}
            <div className="flex justify-center gap-6 mb-8">
              <Link to="#" className='bg-yellow-500 py-2 px-5 text-gray-900 font-semibold rounded-full active:scale-95 hover:bg-yellow-600 transition-all duration-200'>Post</Link>
              <Link to="#" className='bg-gray-700 py-2 px-5 text-white font-semibold rounded-full hover:bg-gray-600 transition-all duration-200'>Reels</Link>
              <Link to="#" className='bg-gray-700 py-2 px-5 text-white font-semibold rounded-full hover:bg-gray-600 transition-all duration-200'>Saved</Link>
            </div>

            {/* Posts Grid */}
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {userData.post && userData.post.length > 0 ? (
                userData.post.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => openModal(item)}
                    className='relative h-[150px] sm:h-[200px] w-full overflow-hidden rounded-lg border border-gray-700 cursor-pointer hover:scale-105 transition-transform duration-200 shadow-lg bg-gray-900 group'
                  >
                    <img
                      src={item.Post.secureUrl}
                      alt="img"
                      className='w-full h-full object-cover rounded-lg group-hover:brightness-75 transition-all duration-200'
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="flex items-center text-white text-lg font-bold bg-black/50 p-2 rounded-full">
                        <BiLike className="mr-2 text-xl" />
                        {item.like?.length || 0}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-400 mt-8">No posts to display.</div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isFollowingModalOpen && (
          <Listfollowing data={userData?.followingd} onClose={closeFollowingModal} />
      )}
    </HomeLayout>
  )
}

export default Followinguser
