import mongoose from "mongoose";
function connectDB(){
    mongoose.connect("mongodb://localhost:27017/view")
    .then(()=>{
        console.log("mongoDb Connected..");
    })
    .catch(()=>{
        console.log("error..",err);
    })
}
export default connectDB