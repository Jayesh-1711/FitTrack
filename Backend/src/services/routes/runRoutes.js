import express from "express"
import RunModel from "../models/runModel.js";
//const express=require('express')
//const Run=require('../models/runModel')
const router=express.Router();
import authMiddleware from "../middleware/authMiddleware.js";
//const auth=require('./auth.routes')
router.post("/RunTrack",authMiddleware,async (req,res)=>{
try{
    const run=await RunModel.create({
        user:req.user.id,
        ...req.body
 } )
 res.status(200).json({message:"Run done.."})
}catch(err){
    res.status(500).json({message:"failed to save.."})
}
})
router.get("/RunTrack",authMiddleware,async(req,res)=>{
    const runs=await RunModel.find({user:req.user.id})
    res.json(runs);
})
router.get("/:id", authMiddleware, async (req, res) => {
  const run = await RunModel.findById(req.params.id);
  res.json(run);
});
export default router;