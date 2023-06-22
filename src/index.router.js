
import authRouter from './modules/auth/auth.router.js'
import branRouter from './modules/brand/brand.router.js'
import cartRouter from './modules/cart/cart.router.js'
import categoryRouter from './modules/category/category.router.js'
import couponRouter from './modules/coupon/coupon.router.js'
import orderRouter from './modules/order/order.router.js'
import productRouter from './modules/product/product.router.js'
import reviewsRouter from './modules/reviews/reviews.router.js'
import subcategoryRouter from './modules/subcategory/subcategory.router.js'
import userRouter from './modules/user/user.router.js'
import connectDB from '../DB/connection.js'
import { globalErrorHandling } from './utils/errorHandling.js'
import morgan from 'morgan'
import cors from "cors"

const initApp = (app, express) => {
  // var whiteList = ["http://127.0.0.1:5500"] //FE links
  // app.use(async(req,res,next)=>{
  //   if(!whiteList.includes(req.header("origin"))){
  //     return next(new Error("Not Allowed by CROS",{cause :403}))
  //   }
  //   for (const origin of whiteList){
  //     if(req.header("origin")==origin){
  //       await res.header("Access-Control-Allow-Origin",origin)
  //       break;
  //     }
  //   }
  //   await res.header("Access-Control-Allow-Headers","*")
  //   await res.header("Access-Control-Allow-Private-Network","true")
  //   await res.header("Access-Control-Allow-Methods","*")
  //   next();

  // })
  app.use(cors())
  
    if(process.env.MOOD == "DEV"){
      app.use(morgan("dev"))

    }
    //convert Buffer Data
    app.use(express.json({}))
    //Setup API Routing 
    app.use(`/auth`, authRouter)
    app.use(`/user`, userRouter)
    app.use(`/product`, productRouter)
    app.use(`/category`, categoryRouter)
    app.use(`/subCategory`, subcategoryRouter)
    app.use(`/reviews`, reviewsRouter)
    app.use(`/coupon`, couponRouter)
    app.use(`/cart`, cartRouter)
    app.use(`/order`, orderRouter)
    app.use(`/brand`, branRouter)

    app.all('*', (req, res, next) => {
        res.send("In-valid Routing Plz check url  or  method")
    })


    app.use(globalErrorHandling)
    connectDB()

}


//Skip 
// skip = (page-1 )*size
export default initApp