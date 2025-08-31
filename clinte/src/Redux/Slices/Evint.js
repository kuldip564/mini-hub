import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../helpars/axiosi";
import toast from "react-hot-toast";

const initialState = {
    evintData: [],
}
export const getAllEvint = createAsyncThunk('/evint/get', async (_, thunkAPI) => {
    try {
        const res = await toast.promise(
            axiosInstance.get('/evint'),
            {
                loading: "Evint is finding.....",
                success: "Get evint successfully",
                error: "Failed to fetch evint"
            }
        );              
        return res.data.events;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
        return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
});

export const createNewEvint = createAsyncThunk("/evint/create", async (data) => {
    try {
        let formData = new FormData();
        formData.append("title", data?.title);
        formData.append("description", data?.description);
        formData.append("createdBy", data?.createdBy);
        formData.append("date", data?.date);
        formData.append("time", data?.time);
        formData.append("location", data?.location);
        formData.append("organizer", data?.organizer);
        if (data?.thublenail) {
            formData.append("thublenail", data?.thublenail);
        }

        const response = axiosInstance.post("/evint", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        toast.promise(response, {
            loading: "Creating new evint",
            success: "Evint created successfully",
            error: "Failed to create evint"
        });

        return (await response).data

    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
});

const evintSlice = createSlice({
    name: "evint",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllEvint.fulfilled, (state, action) => {
            if (action.payload) {
                state.evintData = [...action.payload]
                
            }
        })
    }
})
export default evintSlice.reducer;