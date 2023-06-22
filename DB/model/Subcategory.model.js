
import mongoose, { Schema, Types, model } from "mongoose";

const subCategorySchema = new Schema({
    name :{
        type : String,
        required : true,
        unique : true
        , lowercase :true
    },
    slug:{
        type: String,
        required : true
        , lowercase :true

    },
    image :{
        type : Object,
        required : true
    },
    createdBy :{
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    categoryId:{
        type: Types.ObjectId,
        ref: "Category",
        required: true

    },
    isDeleted :{
        type : Boolean,
        default : false

    },
    updatedBy: { type: Types.ObjectId, ref: 'User'}
})
 const subCategoryModel =mongoose.models.Subcategory || model("Subcategory",subCategorySchema)
export default subCategoryModel; 