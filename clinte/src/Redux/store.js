import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./Slices/Authslices";
import courseSliceReducer from './Slices/CourseSlices'
import evintSliceReducer from './Slices/Evint'


const store = configureStore({
    reducer: {
        auth:authReducer,
        course: courseSliceReducer,
        evint: evintSliceReducer
    },
    devTools:true
});
export default store;