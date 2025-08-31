import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../helpars/axiosi";
import toast from "react-hot-toast";

const initialState={
    courseData: []
}
export const getAllCourse = createAsyncThunk('/course/get',async()=>{
    try {
        const res = axiosInstance.get('/course');
        toast.promise(res,{
            loading: "Course is finding.....",
            success: "Get course successfuly",
            error: "Failed to fetch course"
        })
        
        return (await res).data.courses
    } catch (error) {
        toast.error(error?.res?.data?.message)
    }
})
export const createNewCourse = createAsyncThunk("/course/create", async (data) => {
    try {
        let formData = new FormData();
        formData.append("title", data?.title);
        formData.append("description", data?.description);
        formData.append("category", data?.category);
        formData.append("createdBy", data?.createdBy);
        formData.append("thublenail", data?.thublenail);

        const response = axiosInstance.post("/course", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        toast.promise(response, {
            loading: "Creating new course",
            success: "Course created successfully",
            error: "Failed to create course"
        });

        return (await response).data

    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
});
const courseSlice =createSlice({
    name:"course",
    initialState,
    reducers:{},
    extraReducers: (builder)=>{
        builder.addCase(getAllCourse.fulfilled,(state,action)=>{
            if (action.payload) {
                state.courseData=[...action.payload]
            }
        })
    }
})

export default courseSlice.reducer