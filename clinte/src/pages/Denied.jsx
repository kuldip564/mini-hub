import React from 'react'
import HomeLayout from '../layout/HomeLayout'
import { useNavigate } from 'react-router-dom'

const Denied = () => {
    const navigate = useNavigate()
  return (
    <HomeLayout>

    <div className='h-[90vh] w-full flex justify-center items-center flex-col bg-[#1A2238]'>
        <h1>
            <span className='text-9xl text-yellow-500 font-bold tracking-wide'>403</span>
            <span className='text-3xl text-white font-semibold'>Access denied</span>
        </h1>
            <button 
            onClick={()=>{
                navigate(-1)
            }}
            className='px-10 py-5 my-10 rounded-lg border border-yellow-500  active:bg-slate-700 text-cyan-50'>
                Go Back
            </button>
    </div>
    </HomeLayout>
  )
}

export default Denied