
import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const createsubCategory = joi.object({
    name: joi.string().min(2).max(50).required(),
    file:generalFields.file.required(),
    categoryId: generalFields.id
}).required()


export const updatesubCategory = joi.object({
    subcategoryId:generalFields.id,
    categoryId:generalFields.id,
    name: joi.string().min(2).max(50),
    file:generalFields.file
}).required()