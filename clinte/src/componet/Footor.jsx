import { BsFacebook,BsInstagram,BsTwitter,BsLinkedin,} from 'react-icons/bs';
import React from 'react';
const Footer = () => {
    const getyer = new Date()
    const year = getyer.getFullYear()
    return (
        <>
        <footer className=' relative left-0 bottom-0 h-[10vh] py-5 flex flex-col sm:flex-row items-center justify-center text-white bg-gray-800 sm:px-20 '>
        <section className='flex flex-col sm:flex-row items-center justify-between w-full max-w-6xl mx-auto px-4 sm:px-0'>
            copyright &copy; {year} | All rights reserved.
        </section>
        <section className=' flex items-center justify-center gap-5 text-white text-2xl sm:text-3xl  '>
        <a href="">
            <BsFacebook className='hover:text-blue-500 transition-colors duration-300 ' />
        </a>
        <a href="">
            <BsInstagram className='hover:text-pink-500 transition-colors duration-300' />
        </a>
        <a href="">
            <BsTwitter className='hover:text-blue-400 transition-colors duration-300' />
        </a>
        <a href="">
            <BsLinkedin className='hover:text-blue-700 transition-colors duration-300' />
        </a>
        </section>
        </footer>
        </>
    )
}

export default Footer;
