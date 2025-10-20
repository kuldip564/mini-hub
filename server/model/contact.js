import {Schema,model} from "mongoose";

const contactModel = new Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true
    },
    message:{
        type: String,
        required: true,
        minlength: [50, "Description cannot exceed 500 characters"]
    }
})

const Contect = model('contect',contactModel)
export default Contect
