import { Router } from "express";
import { login, logout, me, register,forgotPassword,resetpassword, edit_profile, findall ,SearchUser,follow,unFollow,addPost,followingPost,likePost, commentPost} from "../controlers/user.js";
import {isLoggedIn} from "../maidlewhere/authmaidlewhare.js";
import upload from "../maidlewhere/multer.js";

const userRouter = Router();

userRouter.post('/register', upload.single('avatar'), register);
userRouter.post('/login', login);
userRouter.get('/logout', logout);
userRouter.get('/me', isLoggedIn, me);
userRouter.post('/forgot-password',forgotPassword);
userRouter.post('/reset-password/:token',resetpassword) 
userRouter.post('/edit-profile', isLoggedIn, upload.single('avatar'), edit_profile);
userRouter.get('/all',isLoggedIn,findall)
userRouter.post('/search',isLoggedIn,SearchUser)
userRouter.post("/follow",isLoggedIn,follow);
userRouter.post('/unFollow', isLoggedIn, unFollow)
userRouter.post("/addPost",isLoggedIn,upload.single('Post'),addPost)
userRouter.get('/followingPost', isLoggedIn, upload.single('Post'),isLoggedIn,followingPost);
userRouter.post("/like",isLoggedIn,likePost)
userRouter.post('/comment',isLoggedIn,commentPost)
export default userRouter;
