import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllCourse } from '../../Redux/Slices/CourseSlices'
import HomeLayout from '../../layout/HomeLayout'
import CourseCard from '../../componet/CourseCard'
import { useNavigate } from 'react-router-dom'

const CourseList = () => {
     const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
     const navigate = useNavigate()
    const dispatch = useDispatch()
    async function GetCourse() {
        await dispatch(getAllCourse())
    }
    const { courseData } = useSelector((state) => state.course)
    console.log(courseData);
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login')
        }
        GetCourse()
    }, [isLoggedIn, navigate])


    return (
    <HomeLayout>
        <div className="min-h-[90vh] pt-12 flex flex-col bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 gap-10">
            <h1 className="text-3xl mt-20 text-center font-extrabold tracking-tight text-gray-100 drop-shadow-lg">
                Explore the courses made by <span className="font-extrabold text-yellow-400">Techar</span>
            </h1>
            <div className="mb-10 flex flex-wrap gap-14 justify-center">
            {courseData.map((data, idx) => (
                <div key={data._id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 60}ms` }}>
                    <CourseCard data={data} />
                </div>
            ))}
            </div>
        </div>
    </HomeLayout>
  )
}

export default CourseList