import subCategoryModel from '../../../../DB/model/Subcategory.model.js';
import categoryModel from '../../../../DB/model/Category.model.js';
import cloudinary from '../../../utils/cloudinary.js'
import slugify from 'slugify'
import { asyncHandler } from '../../../utils/errorHandling.js';




export const subcategoryList = asyncHandler(async (req, res, next) => {
    const subcategory = await categoryModel.find({ isDeleted: false });
    return res.status(200).json({ message: "Done", subcategory })
})

export const createsubCategory = asyncHandler(async(req,res,next)=>{
    
    const {categoryId} = req.params;
    const category = await categoryModel.findById(categoryId);
   
    if(!category){
        return next(new Error("in-valid category ID"),{cause : 404})
    }
    const {name,createdBy} = req.body;
    const {secure_url,public_id} =await cloudinary.uploader.upload(req.file.path ,{ folder: `${process.env.APP_NAME}/category/${categoryId}` })
    const subcategory = await subCategoryModel.create({
        name,
        slug:slugify(name ,"_"),
        image : {secure_url,public_id},
        categoryId,
        createdBy
    });
    if(!subcategory){
        await cloudinary.uploader.destroy(public_id);
        return next(new Error("fail to create this category ",{cause : 400}))
    }
    return res.status(201).json({message : "Done",subcategory})
})


export const updatesubCategory = asyncHandler(async (req, res, next) => {
    const {subcategoryId,categoryId} = req.params;
    const subcategory = await subCategoryModel.findOne({_id:subcategoryId,categoryId})
    if (!subcategory) {
        return next(new Error("In-valid subcategory ID", { cause: 404 }))
    }

    if (req.body.name) {
        subcategory.name = req.body.name;
        subcategory.createdBy = req.body.createdBy;
        subcategory.slug = slugify(req.body.name, '_');
    }

    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
            { folder: `${process.env.APP_NAME}/category/${categoryId}` })
        await cloudinary.uploader.destroy(subcategory.image.public_id)
        subcategory.image = { secure_url, public_id }
    }
   
    await subcategory.save()
    return res.status(200).json({ message: "Done", subcategory })
})