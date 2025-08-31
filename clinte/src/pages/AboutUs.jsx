import React from 'react'
import HomeLayout from '../layout/HomeLayout'
import aboutmainimg from '../assets/img/aboutMainImage.png'

const AboutUs = () => {
  return (
    <HomeLayout>
        <div className='pl-20 pt-20 flex flex-col text-white'>
            <div className='flex items-center gap-5 mx-10'>
                <section className='w-1/2 space-y-10'>
                <h1 className='text-5xl text-yellow-500 font-semibold'>Affordable and qulality eduction</h1>
                <p className='text-lg text-gray-300 mt-5'>
                    Our goal is to provide the affordable and quality eduction to the word 
                    we are providing the platform for the aspiring techars and students to share
                    their skills , creativity to each other to empower and conteribute in the growth of the world.
                </p>
                </section>
                <div className='w-1/2'>
                <img src={aboutmainimg}
                 alt=""
                id='test1'
                style={{
                  filter: 'drop-shadow(0px 0px 10px rgba(255, 255, 0, 0.5))',
                  width: '100%',
                  height: 'auto',
                }}
                className='droqp-shadow-2xl'
                 />
                
                </div>
            </div>
            
        </div>
    </HomeLayout>
  )
}

export default AboutUs