import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true,
     validate: {
        validator: function (value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "enter an velid email",
      },
      lowercase : true
    },
    password : {
        type : String,
        required : true,
    }
},{timestamps : true})

export const User = mongoose.model("User" , userSchema)