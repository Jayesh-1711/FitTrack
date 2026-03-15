import React from "react";
import { Route,BrowserRouter,Routes } from "react-router-dom";
import Reg from "../Pages/Reg";
import Log from "../Pages/Log";
import RunTracker from "../Pages/Tracker";
import Home from "../Pages/Home";
import Profile from "../Pages/Profile";
import RunDetails from "../Pages/Rundetails";
export default function FitRoutes(){
    return(
        <BrowserRouter>
        <Routes>
           <Route path="/home" element={<Home/>}></Route>
          <Route path="/" element={<Reg/>}>reg</Route>  
          <Route path="/user/log" element={<Log/>}></Route>
          <Route path="/track" element={<RunTracker/>}></Route>
          <Route path="/profile" element={<Profile/>}></Route>
          <Route path="/run/:id" element={<RunDetails/>}></Route>
        </Routes>
        </BrowserRouter>
    )
}