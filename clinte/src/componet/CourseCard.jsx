import React from 'react'
import { useNavigate } from 'react-router-dom'

const CourseCard = ({ data }) => {
    const navigate = useNavigate()
    return (
        <div
            onClick={() => navigate("/course/description", { state: { ...data } })}
            className="w-[22rem] h-[430px] bg-white/10 backdrop-blur-lg border border-gray-700 shadow-2xl rounded-2xl cursor-pointer group overflow-hidden transition-all duration-300 hover:shadow-yellow-400/30 hover:border-yellow-400 flex flex-col"
        >
            <div className="relative h-48 w-full overflow-hidden">
                <img
                    className="h-48 w-full object-cover rounded-t-2xl transform group-hover:scale-110 transition-all duration-300"
                    src={data?.thublenail?.secureUrl}
                    alt="Course thumbnail"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent" />
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between text-white">
                <h2 className="text-xl font-bold text-yellow-400 line-clamp-2 capitalize mb-1 drop-shadow">{data?.title}</h2>
                <p className="line-clamp-2 text-gray-200 mb-2">{data?.description}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                    <span className="bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-semibold">{data?.category}</span>
                    <span className="bg-gray-800/60 text-gray-200 px-3 py-1 rounded-full text-xs font-semibold">Lectures: {data?.numberOfLectures}</span>
                </div>
                <div className="flex items-center gap-2 mt-auto">
                    <span className="bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-semibold">Instructor</span>
                    <span className="text-gray-100 font-semibold text-sm">{data?.createdBy}</span>
                </div>
            </div>
        </div>
    )
}

export default CourseCard
