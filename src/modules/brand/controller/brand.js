import brandModel from '../../../../DB/model/Brand.model.js';
import cloudinary from '../../../utils/cloudinary.js'
import slugify from 'slugify'
import { asyncHandler } from '../../../utils/errorHandling.js';




export const brandList = asyncHandler(async (req, res, next) => {
    const brand = await brandModel.find({ isDeleted: false })
  
    return res.status(200).json({ message: "Done", brand })
})
export const getSpecificBrand = asyncHandler(async (req, res, next) => {
    const {brandId} = req.params;
    const brand = await brandModel.findById(brandId,{ isDeleted: false })
  
    return res.status(200).json({ message: "Done", brand })
})

export const createBrand = asyncHandler(async(req,res,next)=>{
    const {name} = req.body;
    const {secure_url,public_id} =await cloudinary.uploader.upload(req.file.path ,{ folder: `${process.env.APP_NAME}/brand` })
    const brand = await brandModel.create({
        name,
        slug:slugify(name ,"_"),
        image : {secure_url,public_id},
        createdBy : req.user._id
    });
    if(!brand){
        await cloudinary.uploader.destroy(public_id);
        return next(new Error("fail to create this brand ",{cause : 400}))
    }
    return res.status(201).json({message : "Done",brand})
})


export const updateBrand = asyncHandler(async (req, res, next) => {
    const brand = await brandModel.findById(req.params.brandId)
    if (!brand) {
        return next(new Error("In-valid brand ID", { cause: 404 }))
    }

    if (req.body.name) {
        brand.name = req.body.name;
        brand.slug = slugify(req.body.name, '_');
    }

    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
            { folder: `${process.env.APP_NAME}/brand` });
        if(brand.image.public_id){
            await cloudinary.uploader.destroy(brand.image.public_id)
        }
        
        brand.image = { secure_url, public_id }
    }
    brand.updatedBy = req.user._id
    await brand.save()
    return res.status(200).json({ message: "Done", brand })
})
