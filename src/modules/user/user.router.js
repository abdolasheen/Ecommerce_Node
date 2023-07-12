import { Router } from "express";
const router = Router()

import {auth, roles} from "../../middleware/auth.js"
import userModel from "../../../DB/model/User.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";



router.get('/',auth(Object.keys(roles)),asyncHandler(async (req ,res,next)=>{
    const user = await userModel.findById(req.user._id).select("-password")
   
   return  res.status(200).json({message:"Done" , user})
}))




export default router