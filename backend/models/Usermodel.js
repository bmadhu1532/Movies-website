import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid"; 
const UserSchemaFormat = {
    userId: {
        type: String,
        default: uuidv4,  
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true  
    },
    password: {
        type: String,
        required: true
    }
};

const UserSchema = new Schema(UserSchemaFormat, { timestamps: true }); 

export const UserModel = model("UserDetails", UserSchema);
