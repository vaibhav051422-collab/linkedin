 import mongoose from "mongoose";
 const postSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",

    },
    body:{
        type:String,
        required:true

    },
    liked:{
        type:Number,
        default:0

    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,

    },
    media:{
        type:String,
        default:null

    },
    active:{
        type:Boolean,
        default:true
    },
    fileType:{
        type:String,
        default:null

    }
    });
    const post=mongoose.model("Post",postSchema);
    export default post;