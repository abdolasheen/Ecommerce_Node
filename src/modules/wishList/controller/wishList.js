import userModel from "../../../../DB/model/User.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

export const getWishList = asyncHandler(async (req,res,next)=>{
    const whishList = await userModel.findById(req.user._id).select("wishlist").populate("wishlist")
    return res.json(whishList)
})