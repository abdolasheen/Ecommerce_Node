import { Router } from "express";
import express from "express";
import * as orderController from "./controller/order.js"
import { auth, roles } from "../../middleware/auth.js";
import  {endPoint} from "./order.endPoint.js"
import { validation } from "../../middleware/validation.js";
import * as validators from "./order.validation.js"

const router = Router()




router.post("/",auth(Object.keys(roles)),
validation(validators.createOrder),
 orderController.createOrder)

 router.get("/",auth(Object.keys(roles)),

 orderController.getUserOrders)

 router.get("/:orderId",auth(Object.keys(roles)),
validation(validators.getOrderById),


 orderController.getOrderById)

 router.patch("/:orderId",auth(Object.keys(roles)),
validation(validators.cancelOrder),
 orderController.cancelOrder)

 router.patch("/:orderId/updateOrderStatusByAdmin",auth(roles.Admin),
 validation(validators.updateOrderStatusByAdmin),
  orderController.updateOrderStatusByAdmin)

// server.js
//
// Use this sample code to handle webhook events in your integration.
//
// 1) Paste this code into a new file (server.js)
//
// 2) Install dependencies
//   npm install stripe
//   npm install express
//
// 3) Run the server on http://localhost:4242
//   node server.js

// The library needs to be configured with your account's secret key.
// Ensure the key is kept out of any version control system you might be using.


router.post('/webhook', express.raw({type: 'application/json'}),orderController.webHook);






export default router