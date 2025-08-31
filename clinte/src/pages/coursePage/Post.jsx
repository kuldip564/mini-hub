import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiFillHeart, AiOutlineHeart, AiOutlineComment, AiOutlineShareAlt } from 'react-icons/ai';
import { commentPost, likePost } from '../../Redux/Slices/Authslices';

const Post = ({ post, userData, onUpdatePost }) => {
    const dispatch = useDispatch();
    const [commentInput, setCommentInput] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [isLiked, setIsLiked] = useState(post.like?.includes(userData?._id));

    useEffect(() => {
        setIsLiked(post.like?.includes(userData?._id));
    }, [post.like, userData?._id]);

    const handleLikePost = async () => {
        if (!userData || !userData._id) {
            console.error("User data is not available.");
            return;
        }

        const postUserId = post.user.id;

        try {
            const response = await dispatch(likePost({ postId: post._id, postUserId }));

            if (response?.payload?.success) {
                const hasLiked = post.like?.includes(userData._id);
                const updatedLikes = hasLiked
                    ? post.like.filter(id => id !== userData._id)
                    : [...(post.like || []), userData._id];

                onUpdatePost({ ...post, like: updatedLikes });
            }
        } catch (error) {
            console.error("Failed to toggle like:", error);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentInput.trim()) return;

        const postUserId = post.user.id;
        const comment = commentInput;
        const postId = post._id;

        try {
            const response = await dispatch(commentPost({ postId, postUserId, comment }));
            if (response?.payload?.success) {
                const newComment = { comment, user: userData };
                onUpdatePost({
                    ...post,
                    comments: [...(post.comments || []), newComment]
                });
                setCommentInput('');
                setShowCommentInput(false);
            }
        } catch (error) {
            console.error("Failed to comment on post:", error);
        }
    };

    return (
        <div className="bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 overflow-hidden transition-transform duration-300 hover:scale-[1.015] group">
            {/* Header */}
            <div className="flex items-center p-4">
                <img
                    src={post?.user?.avatar?.secureUrl || '/default-avatar.png'}
                    alt="avatar"
                    className="w-11 h-11 rounded-full object-cover mr-4 border-2 border-yellow-400 group-hover:border-yellow-500 transition duration-200 shadow"
                />
                <div>
                    <h3 className="text-white font-semibold text-base truncate max-w-[120px]">{post?.user?.name || 'Unknown'}</h3>
                    <p className="text-sm text-gray-400 truncate max-w-[120px]">@{post?.user?.username}</p>
                </div>
            </div>

            {/* Post image */}
            <div className="relative">
                <img
                    src={post?.Post?.secureUrl}
                    alt="post"
                    className="w-full object-cover max-h-[600px]"
                />
                <div className="absolute bottom-2 right-2 text-xs bg-black bg-opacity-50 text-white px-2 py-1 rounded-md shadow-md">
                    Image
                </div>
            </div>

            {/* Post footer */}
            <div className="p-4 space-y-2">
                <div className="flex items-center gap-6 text-white text-2xl">
                    <button
                        onClick={handleLikePost}
                        className={`transition-transform hover:scale-110 ${isLiked ? 'text-red-500' : 'text-white'}`}
                    >
                        {isLiked ? <AiFillHeart /> : <AiOutlineHeart />}
                    </button>
                    <button
                        onClick={() => setShowCommentInput(!showCommentInput)}
                        className="hover:text-yellow-500 transition-transform hover:scale-110"
                    >
                        <AiOutlineComment />
                    </button>
                    <button className="hover:text-yellow-500 transition-transform hover:scale-110">
                        <AiOutlineShareAlt />
                    </button>
                </div>

                <div className="text-white font-semibold text-sm">{post.like?.length || 0} likes</div>
                <p className="text-gray-300 text-sm">
                    <span className="font-semibold text-white mr-1">@{post?.user?.username}</span>
                    {post?.title || 'No caption provided.'}
                </p>

                {/* View all comments */}
                {post.comments?.length > 0 && (
                    <p
                        onClick={() => setShowComments(!showComments)}
                        className="text-xs text-gray-500 mt-1 hover:underline cursor-pointer"
                    >
                        {showComments ? `Hide all comments` : `View all ${post.comments.length} comments`}
                    </p>
                )}

                {/* Comments List */}
                {showComments && post.comments?.map((cmt, idx) => (
                    <p key={idx} className="text-gray-400 text-sm">
                        <span className="font-semibold text-white mr-1">@{cmt.user?.name || 'user'}</span>{cmt.comment}
                    </p>
                ))}
            </div>

            {/* Comment Input */}
            {showCommentInput && (
                <form onSubmit={handleCommentSubmit} className="p-4 pt-0">
                    <input
                        type="text"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="mt-2 px-4 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition"
                    >
                        Post
                    </button>
                </form>
            )}
        </div>
    );
};

export default Post;