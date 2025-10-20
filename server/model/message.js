import { Schema, model } from "mongoose";

const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    messageType: {
        type: String,
        enum: ["text", "image", "file", "audio", "video"],
        default: "text"
    },
    fileUrl: String,
    chat: {
        type: Schema.Types.ObjectId,
        ref: "Chat",
        required: true
    },
    status: {
        type: String,
        enum: ["sent", "delivered", "seen"],
        default: "sent"
    }
}, {
    timestamps: true
});

const Message = model("Message", messageSchema);
export default Message;