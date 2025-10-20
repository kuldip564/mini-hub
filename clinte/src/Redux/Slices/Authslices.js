import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from "../../helpars/axiosi";


const initialState = {
    isLoggedIn: localStorage.getItem('isLoggedIn') || false,
    role: localStorage.getItem('role') || "",
    data: localStorage.getItem('data') || {},
}

export const createAccount = createAsyncThunk('/auth/signup', async (data) => {
    try {
        const resPromise = axiosInstance.post('user/register', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        toast.promise(resPromise, {
            loading: "Creating your account...",
            success: (res) => res?.data?.message || "Account created!",
            error: "Failed to create account"
        });

        const res = await resPromise;
        return res.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
        throw error;
    }
});

export const login = createAsyncThunk('/auth/login', async (data) => {
    try {
        const resPromise = axiosInstance.post('user/login', data,);
        toast.promise(resPromise, {
            loading: "wite for login...",
            success: (res) => res?.data?.message || "login successfuly",
            error: "Failed to login"
        });

        const res = await resPromise;
        return res.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
        throw error;
    }
});

export const logout = createAsyncThunk('/auth/logout', async () => {
    try {
        const resPromise = axiosInstance.get('user/logout');

        toast.promise(resPromise, {
            loading: "Logging out...",
            success: (res) => res?.data?.message || "Logged out successfully!",
            error: "Failed to logout"
        });

        const res = await resPromise;
        return res.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
        throw error;
    }
});

export const getUserData = createAsyncThunk("/user/details", async () => {
    try {
        const res = axiosInstance.get("user/me");
        return (await res).data;
    } catch (error) {
        toast.error(error.message);
    }
})

export const userFindbySearching = createAsyncThunk("/user/find", async (search) => {
    try {
        const res = axiosInstance.post("user/search", { search: search });
        return (await res).data.userditel;
    } catch (error) {
        console.log(error);

    }
});
export const unFollowUser = createAsyncThunk("/user/unfollow", async (data) => {
    try {
        const res = axiosInstance.post("user/unFollow", data);
        toast.promise(res, {
            loading: "Unfollowing user...",
            success: (data) => {
                return data?.data?.message || "Unfollowed successfully!";
            },
            error: "Failed to unfollow user"
        });
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
        throw error;
    }
})

export const allPost = createAsyncThunk("/user/allPost", async () => {
    try {
        const res = axiosInstance.get('/user/followingPost');
        console.log(res);

        toast.promise(res, {
            loading: "finding data....",
            success: "find data successfuly",
            error: "samthin wriong"
        })
        const data = await res
        console.log(data);

        return data
    } catch (error) {
        toast(error)
    }
})

export const likePost = createAsyncThunk("/user/like", async ({ postId, postUserId }) => {
    try {
        const res = axiosInstance.post("user/like", { postId, postUserId });

        toast.promise(res, {
            loading: "Liking post...",
            success: (data) => data?.data?.message || "Liked successfully!",
            error: "Failed to like post"
        });

        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
        throw error;
    }
});


export const followUser = createAsyncThunk("/user/follow", async (data) => {
    try {
        const res = axiosInstance.post("user/follow", data);
        toast.promise(res, {
            loading: "Following user...",
            success: (data) => {
                return data?.data?.message || "Followed successfully!";
            },
            error: "Failed to follow user"
        });
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
        throw error;
    }
})
export const updateProfile = createAsyncThunk("/user/update/profile", async (data) => {
    try {
        const res = axiosInstance.post(`user/edit-profile/`, data[1]);
        toast.promise(res, {
            loading: "Wait! profile update in progress...",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to update profile"
        });
        return (await res).data;

    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
})

export const findUsers = createAsyncThunk("/user/find/all", async () => {
    try {
        const res = axiosInstance.get("user/all");
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
        throw error;
    }
})
export const addPost = createAsyncThunk('/auth/addPost', async (data) => {
    try {
        const resPromise = axiosInstance.post('user/addPost', data);

        toast.promise(resPromise, {
            loading: "Logging post...",
            success: (res) => res?.data?.message || "Add post successfully!",
            error: "Failed to post"
        });

        const res = await resPromise;
        return res.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
        throw error;
    }
});

export const commentPost = createAsyncThunk('/auth/commentPost', async ({ postId, postUserId, comment }) => {
    try {
        const resPromise = axiosInstance.post('user/comment', { postId, postUserId, comment });
        toast.promise(resPromise, {
            loading: "Adding comment...",
            success: (res) => res?.data?.message || "Comment added successfully!",
            error: "Failed to add comment"
        });
        const res = await resPromise;
        return res.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
        throw error;
    }
});



const authclice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, action) => {
            localStorage.setItem('data', JSON.stringify(action?.payload?.user))
            localStorage.setItem("isLoggedIn", true)
            localStorage.setItem("role", action?.payload?.user?.role)
            console.log(action.payload.user);

            state.isLoggedIn = true;
            state.data = action?.payload?.user
            state.role = action?.payload?.user?.role
        }).addCase(logout.fulfilled, (state) => {
            localStorage.clear()
            state.data = {}
            state.isLoggedIn = false
            state.role = ''
        }).addCase(getUserData.fulfilled, (state, action) => {
                if (!action?.payload?.user) return;
                localStorage.setItem("data", JSON.stringify(action?.payload?.user));
                localStorage.setItem("isLoggedIn", true);
                localStorage.setItem("role", action?.payload?.user?.role);
                localStorage.setItem("following", action?.payload?.user?.following || '');
                localStorage.setItem("followers", action?.payload?.user?.followers || '');
                state.isLoggedIn = true;
                state.data = action?.payload?.user;
                state.role = action?.payload?.user?.role
                state.following = action?.payload?.user?.following || '';
                state.followers = action?.payload?.user?.followers || '';
            })
    }
})

export default authclice.reducer;