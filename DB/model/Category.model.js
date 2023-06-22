import mongoose, { model, Schema, Types } from "mongoose";

const categorySchema = new Schema({
    name: { type: String, required: true, unique : true , lowercase :true},
    slug: { type: String, required: true , lowercase :true},
    image: { type: Object, required: true },
  
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Types.ObjectId, ref: 'User'}
}, {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}

})

categorySchema.virtual("subcategory",{
    ref:"Subcategory",
    localField:"_id",
    foreignField:"categoryId",
})

const categoryModel = mongoose.models.Category || model('Category', categorySchema)
export default categoryModel