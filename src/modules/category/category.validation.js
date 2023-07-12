
import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const createCategory = joi.object({
    name: joi.string().min(2).max(50).required(),
    file:generalFields.file.required()
}).required()


export const updateCategory = joi.object({


    categoryId:generalFields.id,
    name: joi.string().min(2).max(50),
    file:generalFields.file
}).required();

export const getCategoryById = joi.object({


    id:generalFields.id,
   
}).required()