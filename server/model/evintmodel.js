import {Schema,model} from "mongoose";

const evintSchema = new Schema({
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
    createdBy: {
        type: String,
        required: true
    },
    thublenail: {
        publicId: {
            type: String,
        },
        secureUrl: {
            type: String,
        }
    },
    date: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    organizer: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
const Evint = model("Evint", evintSchema);
export default Evint;