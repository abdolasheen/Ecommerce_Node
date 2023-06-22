import slugify from "slugify";
import brandModel from "../../../../DB/model/Brand.model.js";
import subCategoryModel from "../../../../DB/model/Subcategory.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import cloudinary from "../../../utils/cloudinary.js";
import productModel from "../../../../DB/model/Product.model.js";
// import nanoId from "nanoId";
import { nanoid } from 'nanoid'
import userModel from "../../../../DB/model/User.model.js";
export const addProduct = asyncHandler(async(req,res,next)=>{

    const {name ,price,discount,colors,size,categoryId,subcategoryId,brandId} = req.body;
    
    if(!await subCategoryModel.findOne({ _id : subcategoryId , categoryId})){
        return next(new Error("In-valid Category or SubCategory Id",{cause : 400}))
    }
    if(!await brandModel.findOne({ _id : brandId })){
        return next(new Error("In-valid Brand Id",{cause : 400}))
    }
    req.body.slug= slugify(name,{
        replacement :"_",
        trim:true,
        lower : true
    })
    req.body.finalPrice = Number.parseFloat( price - (price * ((discount || 0) / 100)) ).toFixed(2);
    req.body.customId = nanoid();
    const {secure_url , public_id} = await cloudinary.uploader.upload(req.files.mainImage[0].path,{folder :`${process.env.APP_NAME}/product/${req.body.customId}`});
    req.body.mainImage= {secure_url , public_id};
    if(req.files.subImages){
        req.body.subImages = [];
        for (const file of req.files.subImages) {
            
             const {secure_url , public_id} = await cloudinary.uploader.upload(file.path,{folder :`${process.env.APP_NAME}/product/${req.body.customId}/subImages`});
            req.body.subImages.push({secure_url , public_id});
        }
    }
    req.body.createdBy = req.user._id
    const product = await productModel.create(req.body);
    if(!product){
        return next(new Error("Failed to create this product",{cause : 400}))
    }
   return res.status(201).json({message :"Done" , product})
    // check subCategory&category , checkBrand  
    // add images
    // add user
    // create product
});
export const updateProduct = asyncHandler(async (req,res,next)=>{

    const {productId} = req.params;
    const {name ,price,discount,colors,size,categoryId,subcategoryId,brandId} = req.body;


    const product = await productModel.findById(productId);
    if(!product){
        return next(new Error("In valid product Id" , {message :400 }))
    }

    if(categoryId && subcategoryId ){
        if(!await subCategoryModel.findOne({ _id : subcategoryId , categoryId})){
            return next(new Error("In-valid Category or SubCategory Id",{cause : 400}))
        }
    }
    if(brandId){
        if(!await brandModel.findOne({ _id : brandId })){
            return next(new Error("In-valid Brand Id",{cause : 400}))
        }
    }
    if(name){
        req.body.slug= slugify(name,{
            replacement :"_",
            trim:true,
            lower : true
        });
    }
    if(price && discount){
        req.body.finalPrice = Number.parseFloat( price - (price * ((discount || 0) / 100)) ).toFixed(2);
    }else if(price){
        req.body.finalPrice = Number.parseFloat( price - (price * ((product.discount ) / 100)) ).toFixed(2);
    }else if(discount){
        req.body.finalPrice = Number.parseFloat( product.price - (product.price * ((discount ) / 100)) ).toFixed(2);

    }
    if(req.files?.mainImage?.length){
        const {secure_url , public_id} = await cloudinary.uploader.upload(req.files.mainImage[0].path,{folder :`${process.env.APP_NAME}/product/${product.customId}`});
        await  cloudinary.uploader.destroy(product.mainImage.public_id)
        req.body.mainImage= {secure_url , public_id};

    }

   
    if(req.files?.subImages?.length){
        req.body.subImages = [];
        for (const file of req.files.subImages) {
            
             const {secure_url , public_id} = await cloudinary.uploader.upload(file.path,{folder :`${process.env.APP_NAME}/product/${req.body.customId}/subImages`});
            req.body.subImages.push({secure_url , public_id});
        }
    }
    req.body.createdBy = req.user._id
    const newProduct = await productModel.updateOne({_id: product._id},req.body,{new : true});
    
   return res.status(200).json({message :"Done" , newProduct})



})

export const addToWishlist = asyncHandler(async(req,res,next)=>{
    if (!await productModel.findById(req.params.productId)){
        return next(new Error("in-valid product"))
    }
    await userModel.updateOne({_id:req.user._id},{
        $addToSet :{
            wishlist :req.params.productId
        }
    })
    return res.status(200).json({message :"Done"})
})

export const removeToWishlist = asyncHandler(async(req,res,next)=>{
   
    await userModel.updateOne({_id:req.user._id},{
        $pull :{
            wishlist :req.params.productId
        }
    })
    return res.status(200).json({message :"Done"})
})