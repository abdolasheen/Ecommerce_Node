import mongoose, { model, Schema, Types } from "mongoose";

const couponSchema = new Schema({
    name: { type: String, required: true , unique : true , lowercase :true },
    amount : {type : Number , default : 1 ,required : true},
    expireDate : {type :Date , required : true},
    image: { type: Object },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true }, //Don't forget to change it to true after the prototype
    usedBy:[ { type: Types.ObjectId, ref: 'User', required: false }], //Don't forget to change it to true after the prototype
    isDeleted: { type: Boolean, default: false },

    updatedBy: { type: Types.ObjectId, ref: 'User'},
}, {
    timestamps: true
  

})



const couponModel = mongoose.models.Coupon || model('Coupon', couponSchema)
export default couponModel