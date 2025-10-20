import { Router } from "express";
import { getAllCourses,getByIdLectures,createCourse,updateCourse,removeCourse,createLecture,deleteLecture} from "../controlers/couers.js";
import { get } from "mongoose";
import upload from "../maidlewhere/multer.js";
import {authorizeRoles, isLoggedIn }from "../maidlewhere/authmaidlewhare.js";

const courseRouter = Router();

courseRouter.route('/')
.get(isLoggedIn,getAllCourses)
.post(isLoggedIn,authorizeRoles("ADMIN"),upload.single('thublenail'),createCourse)

courseRouter.route('/:id')
.get(isLoggedIn,authorizeRoles("ADMIN"),getByIdLectures)
.put(isLoggedIn,authorizeRoles("ADMIN"),upload.single('thublenail'),updateCourse) 
.delete(isLoggedIn,authorizeRoles("ADMIN"),removeCourse)
.post(isLoggedIn,authorizeRoles("ADMIN"),upload.single('lecture'),createLecture);


courseRouter.route('/lecture/:id')
.delete(isLoggedIn,authorizeRoles("ADMIN"),deleteLecture)

export default courseRouter;