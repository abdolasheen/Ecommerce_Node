import couponModel from '../../../../DB/model/Coupon.model.js';
import cloudinary from '../../../utils/cloudinary.js'

import { asyncHandler } from '../../../utils/errorHandling.js';




export const couponList = asyncHandler(async (req, res, next) => {
    const coupon = await couponModel.find({ isDeleted: false });

    return res.status(200).json({ message: "Done", coupon })
})


export const createCoupon = asyncHandler(async(req,res,next)=>{
  
    const name = req.body.name.toLowerCase();
    
    if(await couponModel.findOne({name })){
        next(new Error("Duplicated coupon Name" , {cause : 409}))
    }
    if(req.file){
        const {secure_url,public_id} =await cloudinary.uploader.upload(req.file.path ,{ folder: `${process.env.APP_NAME}/coupon` })
        req.body.image = {secure_url,public_id};
    }
    req.body.createdBy = req.user._id;
    req.body.expireDate = new Date(req.body.expireDate);
    
    const coupon = await couponModel.create(req.body)
    if(!coupon){
       
        if(coupon.image )  await cloudinary.uploader.destroy(public_id);
        return next(new Error("fail to create this coupon ",{cause : 400}))
    }
    return res.status(201).json({message : "Done",coupon})
})


export const updateCoupon = asyncHandler(async (req, res, next) => {
    const coupon = await couponModel.findById(req.params.couponId)
    if (!coupon) {
        return next(new Error("In-valid coupon ID", { cause: 404 }))
    }

    if (req.body.name) {
        coupon.name = req.body.name;
    }
    if(req.body.expireDate){
        coupon.expireDate = req.body.expireDate;

    }
    if(req.body.amount){
        coupon.amount = req.body.amount;

    }

    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
            { folder: `${process.env.APP_NAME}/coupon` })
        if(coupon.image){
             await cloudinary.uploader.destroy(coupon.image.public_id)
        }
        coupon.image = { secure_url, public_id }
    }
    await coupon.save()
    return res.status(200).json({ message: "Done", coupon })
})
