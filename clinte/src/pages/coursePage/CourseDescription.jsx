import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import HomeLayout from '../../layout/HomeLayout'
import { useSelector } from 'react-redux'

const CourseDescription = () => {
    const { state } = useLocation()
    const { role } = useSelector((state) => state.auth)
    useEffect(() => {
        console.log(state);
    }, [])
    return (
        <HomeLayout>
            <div className="min-h-[90vh] w-full flex justify-center items-center bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 py-10">
                <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 bg-white/10 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-2xl p-8 md:p-12">
                    <div className="flex flex-col gap-8 items-center">
                        <div className="relative w-full flex justify-center">
                            <img
                                className="w-[90vw] max-w-md rounded-2xl shadow-xl object-cover border-4 border-yellow-400"
                                src={state?.thublenail?.secureUrl}
                                alt={state?.title}
                            />
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-gray-900/60 to-transparent pointer-events-none" />
                        </div>
                        <div className="flex flex-col gap-4 w-full">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-lg">
                                <span className="bg-yellow-400/20 text-yellow-400 px-4 py-1 rounded-full font-semibold text-base">Lectures: {state?.numberOfLectures}</span>
                                <span className="bg-yellow-400/20 text-yellow-400 px-4 py-1 rounded-full font-semibold text-base">Instructor: {state?.createdBy}</span>
                            </div>
                            {role === "ADMIN" ? (
                                <button className="bg-yellow-400 py-3 w-full font-bold rounded-full hover:bg-yellow-500 transition-all duration-200 text-gray-900 shadow-lg text-lg">Watch Lectures</button>
                            ) : (
                                <button className="bg-yellow-400 w-full font-bold py-3 rounded-full hover:bg-yellow-500 transition-all duration-200 text-gray-900 shadow-lg text-lg">Subscribe</button>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-6 justify-center text-gray-100">
                        <h1 className="text-3xl font-extrabold text-yellow-400 mb-2 drop-shadow-lg">{state?.title}</h1>
                        <p className="text-lg text-yellow-300 font-semibold">Course Description:</p>
                        <p className="text-base leading-relaxed text-gray-200">{state?.description}</p>
                    </div>
                </div>
            </div>
        </HomeLayout>
    )
}

export default CourseDescription