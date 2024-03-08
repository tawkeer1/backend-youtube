import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
const userSchema = new Schema(
    {
     userName : {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
     },
     email : {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
     },
     fullName: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true
     },
     avatar: {
        type: String, //cloudinary url
        required:true,
     },
     coverImage: {
        type:String, //cloudinaryurl
     },
     watchHistory: [
        {
        type: Schema.Types.ObjectId,
        ref: "Video"
        }
    ],
     password: {
        type: String,
        require: [true, "Password is required"]
     },
     refreshToken: {
        type: String
     }
    }, {timestamps: true}
    )

userSchema.pre("save", async function(next){
if(!this.isModified("password")) return next();
this.password = bcrypt(this.password,10)
next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
        _id: this._id,
        email: this.email,
        userName: this.userName,
        fullName: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY  
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
        _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRY  
        }
    )
}

export const User = mongoose.models("User", userSchema)