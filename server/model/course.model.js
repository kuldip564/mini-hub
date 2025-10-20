import { model,Schema } from "mongoose";

const courseSchema = new Schema({
    title: {
        type: String,
        required: true,
        maxlength: [100, "Title cannot exceed 100 characters"]
    },
    description: {
        type: String,
        required: true,
        maxlength: [500, "Description cannot exceed 500 characters"]
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    thublenail: {
        publicId: {
            type: String,
        },
        secureUrl: {
            type: String,
        }
    },
    lectures: [
        {
            title: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            lecture:{
                publicId: {
                    type: String,
                },
                secureUrl: {
                    type: String,
                }
            }
        }
    ],
    numberOfLectures: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: String,
    },
},{
    timestamps: true
})

const Course = model("Course", courseSchema);
export default Course;