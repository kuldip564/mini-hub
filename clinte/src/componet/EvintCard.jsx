import React from 'react'

const EvintCard = ({data}) => {
    console.log("data", data);
    
  return (
    <div className='w-[80vw] h-[36vh] bg-gray-800 rounded-lg p-5 flex flex-col justify-between mb-5'>
        <div className='h-[20vh] w-[20vw] flex justify-between items-center mb-3 bg-black'>
        <img className='w-full h-full' src={data.thublenail.secureUrl} alt="" />
        </div>
        <div className='flex justify-between items-center'>
            <h1 className='text-2xl font-bold text-yellow-500'>{data?.title}</h1>
            <div>
            <p className='text-lg text-yellow-400'>Time {data?.time}</p>
            <p className='text-lg text-yellow-400'>Date: {data?.date}</p>
            </div>
        </div>
        <p className='text-lg text-gray-300'>{data?.description}</p>
        <div className='flex justify-end'>
            <button className='bg-yellow-600 py-2 px-5 rounded-md hover:bg-yellow-500 transition-all duration-300 ease-in-out'>Join Evint</button>
        </div>
    </div>
  )
}

export default EvintCard