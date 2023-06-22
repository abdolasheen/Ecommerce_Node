import * as subcategoryController from './controller/subcategory.js'
import * as validators from './subcategory.validation.js'
import { validation } from '../../middleware/validation.js';
import { fileUpload, fileValidation } from '../../utils/multer.js'
import { Router } from "express";
import { auth } from '../../middleware/auth.js';
import { endPoint } from './subcategory.endPoint.js';
const router = Router({mergeParams:true})

router.post('/',
auth(endPoint.create),
    fileUpload(fileValidation.image).single('image'),
    validation(validators.createsubCategory),
    subcategoryController.createsubCategory)


router.put('/:subcategoryId',
auth(endPoint.update),
    fileUpload(fileValidation.image).single('image'),
    validation(validators.updatesubCategory),
    subcategoryController.updatesubCategory)


export default router