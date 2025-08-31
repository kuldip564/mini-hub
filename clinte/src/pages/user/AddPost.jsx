import React, { useState } from 'react';
import HomeLayout from '../../layout/HomeLayout';
import { useDispatch } from 'react-redux';
import { addPost } from '../../Redux/Slices/Authslices';
import { useNavigate } from 'react-router-dom';

const AddPost = () => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const navigate= useNavigate()
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setPreviewImg(reader.result);
      };
    } else {
      setImageFile(null);
      setPreviewImg(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !imageFile) {
      return alert('Title and image are required.');
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('Post', imageFile); // 'file' must match backend field name

    const result = await dispatch(addPost(formData));
    console.log('Add Post Response:', result);

    // Clear form
    setTitle('');
    setImageFile(null);
    setPreviewImg(null);
    navigate("/user/profile")
  };

  return (
    <HomeLayout>
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900">
        <div className="my-10 flex flex-col gap-6 rounded-2xl p-10 w-full max-w-md bg-white/10 backdrop-blur-lg border border-gray-700 shadow-2xl items-center">
          <h2 className="text-2xl font-bold text-yellow-400 mb-2 drop-shadow-lg">Add New Post</h2>

          <div className="bg-gradient-to-tr from-yellow-400 via-yellow-500 to-yellow-600 p-1 rounded-full mb-4">
            {previewImg ? (
              <img
                src={previewImg}
                alt="Preview"
                className="w-36 h-36 object-cover border-4 border-white shadow-lg rounded-full"
              />
            ) : (
              <div className="w-36 h-36 bg-gray-700 flex items-center justify-center text-gray-400 text-4xl border-4 border-white shadow-lg rounded-full">
                <span role="img" aria-label="No image">📷</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4">
            <div className="w-full">
              <label htmlFor="title" className="block text-yellow-300 font-semibold mb-2">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-xl bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition shadow-md"
                placeholder="Enter post title"
              />
            </div>

            <div className="w-full">
              <label htmlFor="image" className="block text-yellow-300 font-semibold mb-2">Image</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="w-full px-4 py-2 rounded-xl bg-gray-800 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-400 transition shadow-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-400 file:text-gray-900 hover:file:bg-yellow-500"
              />
            </div>

            <button
              type="submit"
              className="px-8 py-2 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 text-white rounded-full shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-200 font-bold text-lg border-2 border-gray-900 focus:outline-none"
            >
              Add Post
            </button>
          </form>
        </div>
      </div>
    </HomeLayout>
  );
};

export default AddPost;

