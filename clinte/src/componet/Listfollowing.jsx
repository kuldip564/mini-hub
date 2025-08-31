import React from 'react';
import { FiX } from "react-icons/fi"; // Using a consistent icon from your other code

const Listfollowing = ({ data, onClose }) => {
  return (
    // Backdrop for the modal
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all duration-300'>
      
      {/* Modal Container */}
      <div className='relative bg-gray-900 w-full max-w-sm md:max-w-md max-h-[80vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border-2 border-yellow-400 animate-scaleIn'>
        
        {/* Modal Header */}
        <div className='flex justify-between items-center px-6 py-4 border-b border-gray-700'>
          <h2 className='text-xl font-bold text-white'>Following</h2>
          <button
            onClick={onClose}
            className="text-yellow-400 bg-gray-800 hover:bg-yellow-400 hover:text-gray-900 rounded-full p-2 text-2xl font-bold focus:outline-none shadow-lg transition-all duration-200 border-2 border-yellow-400"
            aria-label="Close"
          >
            <FiX />
          </button>
        </div>

        {/* Scrollable List Body */}
        <div className='flex-1 overflow-y-auto custom-scrollbar px-6 py-4'>
          {data && data.length > 0 ? (
            <div className='space-y-4'>
              {data.map((user, index) => (
                <div key={index} className='flex items-center space-x-4 p-2 rounded-lg transition-colors duration-200 hover:bg-gray-800 cursor-pointer'>
                  {/* Placeholder for Profile Picture */}
                  <div className='w-12 h-12 rounded-full bg-gray-700 flex-shrink-0'></div>
                  <p className='text-lg font-semibold text-white'>
                    {user}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className='flex justify-center items-center h-full min-h-[200px]'>
              <p className='text-gray-400 text-center font-medium'>You are not following anyone yet.</p>
            </div>
          )}
        </div>
        
      </div>

      {/* Embedded CSS for custom scrollbar and animation */}
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
              background: #1F2937; /* gray-800 */
              border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #FBBF24; /* yellow-400 */
              border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #F59E0B; /* yellow-500 */
          }
      `}</style>
    </div>
  );
};

export default Listfollowing;