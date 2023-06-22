import { Router } from "express";
const router = Router()
import * as cartController from "./controller/cart.js"
import { auth, roles } from "../../middleware/auth.js";
import { endPoint } from "./cart.endPoint.js";



router.post("/",auth(Object.keys(roles)),cartController.createCart)
router.patch("/remove",auth(Object.keys(roles)),cartController.deleteItems)
router.patch("/empty",auth(Object.keys(roles)),cartController.empty)




export default router