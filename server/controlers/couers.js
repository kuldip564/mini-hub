import Course from "../model/course.model.js";
import ErrorHandler from "../untils/errorHendlar.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";
const getAllCourses = async(req,res,next)=>{
    const course = await Course.find({}).select("-lectures");
    if(!course){
        return next(new ErrorHandler("No courses found",404));
    }
    res.status(200).json({
        success: true,
        courses: course
    });
}
const getByIdLectures = (res,req,next)=>{
    const { id } = req.params;
    const course = Course.findById(id);
    if(!course){
        return next(new ErrorHandler("Course not found",404));
    }
    res.status(200).json({
        success: true,
        lectures: course.lectures
    })
}
const createCourse = async(req,res,next)=>{
    const { title, description, category,createdBy } = req.body;
    if (!title || !description || !category || !createdBy) {
        return next(new ErrorHandler("Please provide all required fields", 400));
    }
    const course = await Course.create({
        title,
        description,
        category,
        createdBy,
        thublenail: {
            publicId: "defaultPublicId",
            secureUrl: "defaultSecureUrl"
        },
    });
    if (!course) {
        return next(new ErrorHandler("Failed to create course", 500));
    }

    if (req.file) {
        const result =await cloudinary.v2.uploader.upload(req.file.path, {
            folder: "lms",
        });
        if (result) {
            course.thublenail = {
                publicId: result.public_id,
                secureUrl: result.secure_url,
            };

        }
        fs.rm(`temprare/${req.file.filename}`)
    }
    await course.save();
    res.status(201).json({
        success: true,
        course
    });
}
const updateCourse = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      const course = await Course.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
  
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }
  
      if (req.file) {
        // Delete old thumbnail
        if (course.thublenail?.publicId) {
          await cloudinary.v2.uploader.destroy(course.thublenail.publicId);
        }
  
        // Upload new thumbnail
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "lms",
        });
  
        if (result) {
          course.thublenail.publicId = result.public_id;
          course.thublenail.secureUrl = result.secure_url;
        }
  
        // Remove local temp file
        fs.rm(`temprare/${req.file.filename}`);
      }
  
      await course.save();
  
      res.status(200).json({
        success: true,
        course,
      });
  
    } catch (error) {
      next(error);
    }
  };
  
const removeCourse = async(req,res,next)=>{ 
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);
    if(!course){
        return next(new ErrorHandler("Course not found",404));
    }
    // Delete thumbnail from Cloudinary if it exists
    if(course.thublenail?.publicId){
        await cloudinary.v2.uploader.destroy(course.thublenail.publicId);
    }
    res.status(200).json({
        success: true,
        message: "Course deleted successfully"
    });
}
const createLecture = async(req,res,next)=>{
    const { id } = req.params;
    const { title, description } = req.body;
    if (!title || !description) {
        return next(new ErrorHandler("Please provide all required fields", 400));
    }
    const course = await Course.findById(id);
    if (!course) {
        return next(new ErrorHandler("Course not found", 404));
    }
    const lecture = {
        title,
        description,
        lecture: {
            publicId: "defaultLecturePublicId",
            secureUrl: "defaultLectureSecureUrl"
        }
    };
    if (req.file) {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: "lms/lectures",
        });
        if (result) {
            lecture.lecture.publicId = result.public_id;
            lecture.lecture.secureUrl = result.secure_url;
        }
        fs.rm(`temprare/${req.file.filename}`);
    }
    course.lectures.push(lecture);
    course.numberOfLectures = course.lectures.length;
    await course.save();
    res.status(201).json({
        success: true,
        message: "Lecture created successfully",
        lecture
    });

}
const deleteLecture = async(req,res,next)=>{
    const { id } = req.params;
    const { lectureId } = req.body;
    if (!lectureId) {
        return next(new ErrorHandler("Please provide lecture ID", 400));
    }
    const course = await Course.findById(id);
    if (!course) {
        return next(new ErrorHandler("Course not found", 404));
    }
    const lectureIndex = course.lectures.findIndex(lecture => lecture._id.toString() === lectureId);
    if (lectureIndex === -1) {
        return next(new ErrorHandler("Lecture not found", 404));
    }
    
    if (course.lectures[lectureIndex].lecture?.publicId) {
        await cloudinary.v2.uploader.destroy(course.lectures[lectureIndex].lecture.publicId);
    }
    course.lectures.splice(lectureIndex, 1);
    course.numberOfLectures = course.lectures.length;
    await course.save();
    res.status(200).json({
        success: true,
        message: "Lecture deleted successfully"
    });
}
export{
    getAllCourses,
    getByIdLectures,
    createCourse,
    updateCourse,
    removeCourse,
    createLecture,
    deleteLecture
}