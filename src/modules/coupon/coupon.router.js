import * as couponController from './controller/coupon.js'
import * as validators from './coupon.validation.js'
import { validation } from '../../middleware/validation.js';
import { fileUpload, fileValidation } from '../../utils/multer.js'
import { Router, application } from "express";
import { auth, roles } from '../../middleware/auth.js';

const router = Router()


router.get('/',couponController.couponList)



router.post('/',
auth(Object.keys(roles)),
    fileUpload(fileValidation.image).single('image'),
    validation(validators.createCoupon),
    couponController.createCoupon)


router.put('/:couponId',
auth(Object.keys(roles)),
    fileUpload(fileValidation.image).single('image'),
    validation(validators.updateCoupon),
    couponController.updateCoupon)


export default router