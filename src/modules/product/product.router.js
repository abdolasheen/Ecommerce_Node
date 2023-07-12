import { Router } from "express";
const router = Router();
import {fileUpload, fileValidation} from "../../utils/multer.js"
import * as productController from "./controller/product.js"
import { endPoint } from "./product.endPoint.js";
import * as validators from "../product/product.validation.js";
import { validation } from "../../middleware/validation.js";
import { auth, roles } from "../../middleware/auth.js";
import reviewRouter from "../reviews/reviews.router.js"
import productModel from "../../../DB/model/Product.model.js";
import ApiFeatures from "../../utils/apiFeatures.js";
router.use("/:productId/review",reviewRouter)

router.get('/', async(req ,res)=>{
    // console.log(req.query);
   
    const apiFeatures = new ApiFeatures(productModel.find(),req.query).paginate().filter().sort().select().sort();
    const products = await apiFeatures.mongooseQuery
//    const products = await productModel.find().skip(1).limit(1) // skip an limit exist im Mongo DB
   return res.json({products})
})
router.get('/:productId', async(req ,res)=>{
    const {productId} = req.params;
    const product = await productModel.findById(productId)
   return res.json({product})
})

router.post("/",
validation(validators.headers, true),
auth(endPoint.create),
fileUpload(fileValidation.image).fields([
    {name : "mainImage",maxCount : 1},
    {name : "subImages",maxCount : 5},

]),
validation(validators.createProduct),
productController.addProduct)

router.put("/:productId",
auth(endPoint.update),
fileUpload(fileValidation.image).fields([
    {name : "mainImage",maxCount : 1},
    {name : "subImages",maxCount : 5},

]),
validation(validators.updateProduct),
productController.updateProduct)


router.patch("/:productId/wishlist",
auth(Object.keys(roles)),
validation(validators.wishlist),
productController.addToWishlist)



router.patch("/:productId/wishlist/remove",
auth(Object.keys(roles)),
validation(validators.wishlist),
productController.removeToWishlist)
export default router