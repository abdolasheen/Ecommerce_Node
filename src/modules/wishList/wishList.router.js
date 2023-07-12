import { Router } from "express";
import { auth, roles } from "../../middleware/auth.js";
import * as wishListController from "./controller/wishList.js"

const router = Router()



router.get("/",auth(Object.keys(roles)),wishListController.getWishList)



export default router