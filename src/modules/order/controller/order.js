import couponModel from "../../../../DB/model/Coupon.model.js";
import productModel from "../../../../DB/model/Product.model.js";
import orderModel from "../../../../DB/model/Order.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import cartModel from "../../../../DB/model/Cart.model.js";
// import { createInvoice } from "../../../utils/pdf.js"
// ? Method one place orders from postMan
// export const createOrder = async(req,res,next)=>{
//     let {address , phone ,products,note ,couponName ,paymentType} = req.body;
//     // !check coupon
//     if(couponName){
//         const coupon = await couponModel.findOne({name : couponName.toLowerCase(), usedBy :{ $nin : req.user._id }  });
//         if(!coupon || coupon.expireDate < Date.now()){
//             return next(new Error("In-valid or expired Coupon" , {
//                 cause :400
//             }))
//         }
        
//         req.body.coupon = coupon // to be checked
//     }
//     const productIds = []
//     let finalProductList = [];
//     let subtotal  =0;
//     // check products list.
//     for (let product of products) {

//         const checkedProduct = await productModel.findOne({
//             _id : product.productId,
//             stock : {$gt : product.quantity},
//             isDeleted : false
//         });
//         if(!checkedProduct){
//             return next(new Error(`in - valid product id `, {
//                 cause :400
//             }))
//         }
//         productIds.push(product.productId);
//         product.name = checkedProduct.name;
//         // product.quantity = checkedProduct.quantity;
//         product.unitPrice = checkedProduct.finalPrice,
//         product.finalPrice  = product.quantity * checkedProduct.finalPrice;
//         finalProductList.push(product);
//         subtotal +=product.finalPrice



        
//     }
    
//     const order = await orderModel.create({
//         // userId: req.user._id,
//         address,
//         phone,
//         note ,
//         products:finalProductList,
//         couponId : req.body.coupon?._id,
//         subtotal,
//         finalPrice : subtotal-(subtotal*((req.body.coupon?.amount || 0)/100)),
//         paymentType,
//         status : paymentType =="card" ? "waitPayment":"placed",


//     });
//     //decrease Product
//     for(const product of products){
//         await productModel.updateOne({_id : product.prodId},{
//             $inc : {stock :-parseInt(product.quantity)}
//         })
//     }
//     // push user id in coupon
//     if(req.body.coupon){
//         await couponModel.updateOne({
//             _id : req.body.coupon._id
//         },
//         {
//             $addToSet :{
//                 usedBy : req.user._id
//             }
//         }
//         )
//     }
//     // clear items from the cart
//         await cartModel.updateOne({userId: req.user._id},{
//             $pull :{
//                 products:{
//                     productId :{$in : productIds}
//                 }
//             }
//         })
//     return res.status(201).json({message : "Done" , order})

// }
//? Method two convert all cart items to order
// export const createOrder = async(req,res,next)=>{
//     let {address , phone ,note ,couponName ,paymentType} = req.body;
//     const cart = await cartModel.findOne({userId :req.user._id });
//     if(!cart?.products.length){

//         return next(new Error("empty cart" , {
//             cause :400
//         }))
//     }
//     req.body.products = cart.products;


//     // !check coupon
//     if(couponName){
//         const coupon = await couponModel.findOne({name : couponName.toLowerCase(), usedBy :{ $nin : req.user._id }  });
//         if(!coupon || coupon.expireDate < Date.now()){
//             return next(new Error("In-valid or expired Coupon" , {
//                 cause :400
//             }))
//         }
        
//         req.body.coupon = coupon // to be checked
//     }


//     const productIds = []
//     let finalProductList = [];
//     let subtotal  =0;
//     // check products list.
//     for (let product of req.body.products) {

//         const checkedProduct = await productModel.findOne({
//             _id : product.productId,
//             stock : {$gt : product.quantity},
//             isDeleted : false
//         });
//         if(!checkedProduct){
//             return next(new Error(`in - valid product id `, {
//                 cause :400
//             }))
//         }
//         // product => BSON object from DB
//         product = product.toObject()
//         productIds.push(product.productId);
//         product.name = checkedProduct.name;
//         // product.quantity = checkedProduct.quantity;
//         product.unitPrice = checkedProduct.finalPrice,
//         product.finalPrice  = product.quantity * checkedProduct.finalPrice;
//         finalProductList.push(product);
//         subtotal +=product.finalPrice



        
//     }
    
//     const order = await orderModel.create({
//         // userId: req.user._id,
//         address,
//         phone,
//         note ,
//         products:finalProductList,
//         couponId : req.body.coupon?._id,
//         subtotal,
//         finalPrice : subtotal-(subtotal*((req.body.coupon?.amount || 0)/100)),
//         paymentType,
//         status : paymentType =="card" ? "waitPayment":"placed",


//     });
//     //decrease Product stock
//     for(const product of req.body.products){
//         await productModel.updateOne({_id : product.prodId},{
//             $inc : {stock :-parseInt(product.quantity)}
//         })
//     }
//     // push user id in coupon
//     if(req.body.coupon){
//         await couponModel.updateOne({
//             _id : req.body.coupon._id
//         },
//         {
//             $addToSet :{
//                 usedBy : req.user._id
//             }
//         }
//         )
//     }
//     // clear items from the cart
//         await cartModel.updateOne({userId: req.user._id},{
//             products : []
//         })
//     return res.status(201).json({message : "Done" , order})

// }
// ? Method three combine two methods in one End point
export const createOrder = asyncHandler(async(req,res,next)=>{
    let {address , phone ,note ,couponName ,paymentType} = req.body;
   if(!req.body.products){
    const cart = await cartModel.findOne({userId :req.user._id });
    if(!cart?.products.length){

        return next(new Error("empty cart" , {
            cause :400
        }))
    }
    req.body.isCart = true
    req.body.products = cart.products;
   }


    // !check coupon
    if(couponName){
        const coupon = await couponModel.findOne({name : couponName.toLowerCase(), usedBy :{ $nin : req.user._id }  });
        if(!coupon || coupon.expireDate < Date.now()){
            return next(new Error("In-valid or expired Coupon" , {
                cause :400
            }))
        }
        
        req.body.coupon = coupon // to be checked
    }


    const productIds = []
    let finalProductList = [];
    let subtotal  =0;
    // check products list.
    for (let product of req.body.products) {

        const checkedProduct = await productModel.findOne({
            _id : product.productId,
            stock : {$gt : product.quantity},
            isDeleted : false
        });
        if(!checkedProduct){
            return next(new Error(`in - valid product id `, {
                cause :400
            }))
        }
        if(req.body.isCart){
             // product => BSON object from DB
        product = product.toObject()
        }
       
        productIds.push(product.productId);
        product.name = checkedProduct.name;
        // product.quantity = checkedProduct.quantity;
        product.unitPrice = checkedProduct.finalPrice,
        product.finalPrice  = product.quantity * checkedProduct.finalPrice;
        finalProductList.push(product);
        subtotal +=product.finalPrice



        
    }
    
    const order = await orderModel.create({
        userId: req.user._id,
        address,
        phone,
        note ,
        products:finalProductList,
        couponId : req.body.coupon?._id,
        subtotal,
        finalPrice : subtotal-(subtotal*((req.body.coupon?.amount || 0)/100)),
        paymentType,
        status : paymentType =="card" ? "waitPayment":"placed",


    });
    //decrease Product stock
    for(const product of req.body.products){
        await productModel.updateOne({_id : product.prodId},{
            $inc : {stock :-parseInt(product.quantity)}
        })
    }
    // push user id in coupon
    if(req.body.coupon){
        await couponModel.updateOne({
            _id : req.body.coupon._id
        },
        {
            $addToSet :{
                usedBy : req.user._id
            }
        }
        )
    }
    // clear items from the cart
    if(req.body.isCart){
        await cartModel.updateOne({userId: req.user._id},{
            products : []
        })
    }else{


        await cartModel.updateOne({userId: req.user._id},{
                        $pull :{
                            products:{
                                productId :{$in : productIds}
                            }
                        }
                    })
    }
        


    

// const invoice = {
//   shipping: {
//     name: "John Doe",
//     address: "1234 Main Street",
//     city: "San Francisco",
//     state: "CA",
//     country: "US",
//     postal_code: 94111
//   },
//   items: [
//     {
//       item: "TC 100",
//       description: "Toner Cartridge",
//       quantity: 2,
//       amount: order.products[0].quantity
//     },
//     {
//       item: "USB_EXT",
//       description: "USB Cable Extender",
//       quantity: 1,
//       amount: 2000
//     }
//   ],
//   subtotal: 8000,
//   paid: 0,
//   invoice_nr: 1234
// };

// createInvoice(invoice, "invoice.pdf");
return res.status(201).json({message : "Done" , order})


})
export const cancelOrder = asyncHandler(async(req,res,next)=>{
    const {orderId} = req.params;
    const {reason} = req.body;

    const order = await orderModel({userId : req.user._id , _id :orderId });
    if(!order){
        return next(new Error("In-valid order or user ID", {cause : 404}))
    }
    if((order?.status !== "placed" && order.paymentType == "cash" || (order?.status != "waitPayment" && order.paymentType == "card"))){
        return next(new Error(`cannot cancel your order after it has been changed to ${order.status}`,{cause:400}))
    }
    const cancelOrder = await orderModel.updateOne({_id : order._id},{status :"canceled" ,reason , updatedBy : req.user._id});
    if(!cancelOrder.matchedCount){
        return next(new Error(`failed to cancel your order `,{cause:400}))

    }
    for (const product of order.products){
        await productModel.updateOne({_id : product.productId},{$inc :{stock : parseInt(product.quantity)}})
    }
    if(order.couponId){
        await couponModel.updateOne({_id:order.couponId} , {$pull :{usedBy : req.user._id}})
    }
    return res.status(200).json({message : "Done"})
});
export const updateOrderStatusByAdmin = asyncHandler(async(req,res,next)=>{
    const {orderId} = req.params;
    const {status} = req.body;

    const order = await orderModel({userId : req.user._id , _id :orderId });
    if(!order){
        return next(new Error("In-valid order or user ID", {cause : 404}))
    }
  
    const cancelOrder = await orderModel.updateOne({_id : order._id},{status   , updatedBy : req.user._id});
    if(!cancelOrder.matchedCount){
        return next(new Error(`failed to cancel your order `,{cause:400}))

    }
  
    return res.status(200).json({message : "Done"})
})