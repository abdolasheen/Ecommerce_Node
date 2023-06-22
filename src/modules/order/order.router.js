import { Router } from "express";
import * as orderController from "./controller/order.js"
import { auth, roles } from "../../middleware/auth.js";
import  {endPoint} from "./order.endPoint.js"
import { validation } from "../../middleware/validation.js";
import * as validators from "./order.validation.js"

const router = Router()




router.post("/",auth(Object.keys(roles)),
validation(validators.createOrder),
 orderController.createOrder)

 router.patch("/:orderId",auth(Object.keys(roles)),
validation(validators.cancelOrder),
 orderController.cancelOrder)

 router.patch("/:orderId/updateOrderStatusByAdmin",auth(roles.Admin),
 validation(validators.updateOrderStatusByAdmin),
  orderController.updateOrderStatusByAdmin)


export default router