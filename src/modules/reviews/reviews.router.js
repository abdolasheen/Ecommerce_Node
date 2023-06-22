import { Router } from "express";
import * as validators from "./reviews.validation.js"
import {endPoint} from "./reviews.endPoint.js"
import { validation } from "../../middleware/validation.js";
import * as reviewController from "./controller/reviews.js"
import { auth } from "../../middleware/auth.js";
const router = Router({ mergeParams : true })




router.post("/",auth(endPoint.create),
validation(validators.createReview),
reviewController.createReview
)

router.put("/:reviewId",auth(endPoint.update),
validation(validators.updateReview),
reviewController.updateReview
)




export default router