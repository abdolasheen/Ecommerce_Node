import cartModel from "../../../../DB/model/Cart.model.js";
import productModel from "../../../../DB/model/Product.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

export const createCart =asyncHandler(async(req,res,next)=>{
    const {productId , quantity} = req.body;
    const product =  await productModel.findById(productId)
    if(!product){

        return next(new Error("In-valid product Id" , {cause : 400}))
    }
    if(product.stock  < quantity || product.isDeleted){
        await productModel.updateOne({_id : productId} ,{ $addToSet :{wishList : req.user._id} })
        return next(new Error(`not available max available quantity ${product.stock}` , {cause : 400}))

    }
    const cart =await cartModel.findOne({userId : req.user._id});
    if(!cart){
        // console.log("No cart");
       const newCart = await cartModel.create({
        userId : req.user._id,
        products : [{productId,quantity}]
       })
       return res.status(201).json({message : "Done" ,cart : newCart})
    }
    let match = false
    for( let i = 0 ; i< cart.products?.length ; i++) {
        // update quantity
        if(cart.products[i].productId.toString() == productId ){
            cart.products[i].quantity = quantity;
            match = true
            break;
        }

    }
    if(!match){
        cart.products.push({productId , quantity})
    }
    await cart.save()
    return res.status(200).json({message : "Done" ,cart })

})
export const deleteItems = asyncHandler(async(req,res,next)=>{
    const {productIds} = req.body;
    const cart = await cartModel.updateOne({userId: req.user._id},{
        $pull :{
            products :{
                productId :{$in : productIds}
            }
        }
    })

    return res.status(200).json({message:"Done",cart})
})
export const empty = asyncHandler(async(req,res,next)=>{
    
    const cart = await cartModel.updateOne({userId: req.user._id},{
      
            products :[]
        
    })

    return res.status(200).json({message:"Done",cart})
})