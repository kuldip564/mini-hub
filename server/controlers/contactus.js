import Contect from "../model/contact.js"
import User from "../model/user.model.js"
import ErrorHandler from "../untils/errorHendlar.js"

const createContect =async (req,res,next)=>{
    try {
        const {name,email,message} = req.body;
        if (!name|| !email|| !message) {
            next(new ErrorHandler("Enter all value",400))
        }
        const user =await User.findOne({email})
        if(!user){
            next(new ErrorHandler("enter reqister email"))
        }
        else{
        const contect =await Contect.create({
            name,
            email,
            message
        })

        res.json({
            success: true,
            contect
        })
    }
    } catch (error) {
        next(new ErrorHandler(error,401))
    }

}

export {
    createContect
}