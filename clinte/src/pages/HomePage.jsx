import React from 'react'
import {Link} from 'react-router-dom'

import HomeLayout from '../layout/HomeLayout'
import HomePageImg from '../assets/img/homePageMainImage.png'

const HomePage = () => {
  return (
    <HomeLayout>
        <div className='pt-10 text-white flex items-center justify-center gap-10 mx-16 h-[90vh]'>
        <div className='w-1/2 space-y-6'>
        <h1 className='text-5xl font-semibold '>
            Find out best 
            <span className='text-yellow-500 font-bold'>Onlinecourses</span>
        </h1>
        <p className='text-lg text-gray-300'>
            we have a large library of online courses taught by highly skilled and qualified faculties at a very affordable cost.
        </p>
        <div className='space-x-4'>  
          <Link to="/allCourse">
          <button className='bg-yellow-500 px-5 py-3 rounded-md font-semibold text-lg cursor-pointer hover:bg-yellow-600 transition-all ease-in-out duration-300'>
            Explor course
            </button>
          </Link>
          <Link to="/contact">
          <button className=' border border-yellow-500 px-5 py-3 rounded-md font-semibold text-lg cursor-pointer hover:bg-yellow-600 transition-all ease-in-out duration-300'>
            Contact us
            </button>
          </Link>
        </div>
        </div>
        <div className='w-1/2 flex items-center justify-center '> 
        <img src={HomePageImg} alt="home page photo" />

        </div>

        <div className=''>

        </div>
        
        </div>
    </HomeLayout>
  )
}

export default HomePage