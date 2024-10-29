const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:true

    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("gender is not valid");
            }
        }
    },
    photoUrl:{
        type:String,
        default:"https://www.google.com/imgres?q=dummy%20%20photo&imgurl=https%3A%2F%2Fpinnacle.works%2Fwp-content%2Fuploads%2F2022%2F06%2Fdummy-image.jpg&imgrefurl=https%3A%2F%2Fpinnacle.works%2Fdummy-image%2F&docid=DNP0Mre_yiaEeM&tbnid=wNwYhuVmPXUBSM&vet=12ahUKEwjZgsemqrOJAxXGTmwGHVsDIQoQM3oECBUQAA..i&w=452&h=449&hcb=2&ved=2ahUKEwjZgsemqrOJAxXGTmwGHVsDIQoQM3oECBUQAA"
    },
    about:{
        type:String,
        default:"This is the default description"
    },
    skills:{
        type:[String]
    }
},{timestamps:true})

const User = mongoose.model("user",userSchema);

module.exports = User;