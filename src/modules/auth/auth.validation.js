import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const signUp = joi.object({
    userName: joi.string().required(),
    email : generalFields.email,
    password : generalFields.password,
    cPassword : generalFields.cPassword.valid( joi.ref("password"))

}).required()

export const confirmEmail = joi.object({
    token : joi.string().required()
}).required();

export const login = joi.object({
    email : generalFields.email,
    password : generalFields.password

}).required()

export const forgetPassword = joi.object({
    email : generalFields.email,
    forgetCode : joi.string().pattern(new RegExp(/^[0-9]{4}$/)),
    password : generalFields.password,
    cPassword : generalFields.cPassword.valid( joi.ref("password"))


}).required()
export const sendCode = joi.object({
    email : generalFields.email,
 
}).required()