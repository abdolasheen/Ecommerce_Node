import { Router } from "express";
import * as authController from "../auth/controller/registration.js"

import { validation } from "../../middleware/validation.js";
import * as validators from "./auth.validation.js";

const router = Router()



router.post("/signUp",validation(validators.signUp),authController.signUp)
router.get("/confirmEmail/:token",validation(validators.confirmEmail),authController.confirmEmail)
router.post("/login",validation(validators.login),authController.login)
router.patch("/sendCode",validation(validators.sendCode),authController.sendCode)
router.patch("/forgetPassword",validation(validators.forgetPassword),authController.forgetPassword)

export default router