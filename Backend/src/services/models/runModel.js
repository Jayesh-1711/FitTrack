import mongoose from "mongoose"
const runSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"user",
        required:true
    },
    distance:{
        type:Number,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    pace:{
        type:Number,
        required:true
    },
    route: [
    {
      lat: Number,
      lng: Number,
    }
  ]
})
const RunModel=mongoose.model("run",runSchema)
export default RunModel