import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllEvint } from '../../Redux/Slices/Evint'
import HomeLayout from '../../layout/HomeLayout'
import EvintCard from '../../componet/EvintCard'

const EvintMainPage = () => {
    const dispatch = useDispatch()
    const { evintData } = useSelector((state) => state.evint)
    function fetchEvintData() {
        dispatch(getAllEvint())
    }
    console.log("evintData", evintData);
    
    useEffect(() => {
        fetchEvintData()
    }, [dispatch])    
  return (
    <HomeLayout>
        <div className='h-[90vh] w-full flex justify-center items-center flex-col text-white'>
            <div className='h-[10vh] w-full flex justify-center items-center px-10'>
                <button className='py-2 px-3 bg-yellow-600 font-semibold rounded-sm'>Create Evint</button>
            </div>
            <div className='h-[70vh]'>
                {evintData.map((data)=>{
                  return  <EvintCard key={data._id} data={data}/>
                })}
            </div>
        </div>
    </HomeLayout>
  )
}

export default EvintMainPage