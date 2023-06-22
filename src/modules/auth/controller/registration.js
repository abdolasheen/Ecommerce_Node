import { customAlphabet } from "nanoid";
import userModel from "../../../../DB/model/User.model.js";
import { generateToken, verifyToken } from "../../../utils/GenerateAndVerifyToken.js";
import { compare, hash } from "../../../utils/HashAndCompare.js";
import sendEmail from "../../../utils/email.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

export const signUp = asyncHandler(async (req, res, next) => {
  let {  email , password , userName} = req.body;
  // console.log(req.body)
  // check user exists
  if (await userModel.findOne({ email:email.toLowerCase() })) {
    next(new Error("already Registered user", { cause: 409 }));
  }
  // send user email

  const token = generateToken({ payload: { email }, expiresIn: 60 * 60 });
  // const rfToken = generateToken({payload : {id : user._id}, expiresIn : 60 *60*24*30})
  // const link = `${req.protocol}//${req.headers.host}/confirmEmail/${token}`;
  const link = `http://localhost:5000/auth/confirmEmail/${token}`;

  const html = `<h1>please confirm your Email <a href=${link}>Click here</a></h1>`;
  const emailResult = sendEmail({
    to: email,
    subject: `Email Confirmation`,
    html,
  });
  if (!emailResult) {
    return next(new Error("In valid email"));
  }
  const hashedPass = hash({ plaintext: password });
  password = hashedPass;

  const user= await userModel.create({userName,email,password});
  return res.json({ message: "Done", userID :  user._id });
});
export const confirmEmail = asyncHandler(async (req,res,next)=>{
  
  const {token} = req.params;
  const decoded = verifyToken({token});
  if(!decoded.email){
    next(new Error("In valid Token" ,{cause : 409}))
  }
  const user = await userModel.findOne({email : decoded.email})
  if(!user){
    next(new Error("not registered account" ,{ cause : 404}))

  }
  user.confirmEmail = true;
  await user.save();
  return res.status(201).redirect("https://www.google.com.eg/")

})
export const login = asyncHandler(async (req, res, next) => {
  let {  email , password } = req.body;
 
  const user = await userModel.findOne({ email:email.toLowerCase() }) ;
  if (!user) {
    return next(new Error("Not registered account", { cause: 404 }));
  }
  if(!user.confirmEmail){
    return next(new Error("please confirm your email first", { cause: 400 }));

  }
  if(!compare({plaintext : password , hashValue : user.password})){
    return next(new Error("In-valid login data",{cause : 400}))
  }
  const access_token = generateToken({payload : {_id : user._id , role : user.role} , expiresIn :60 *60*24*365})
  const refresh_token = generateToken({payload : {_id : user._id , role : user.role} , expiresIn : 60 *60*24*365});
  user.status = "online";
  await user.save();
  return res.status(200).json({message : "Done" , access_token , refresh_token})

});
export const sendCode = asyncHandler(async(req,res,next)=>{
  const {email} = req.body;
  const nanoid = customAlphabet("123456789",4);
  const forgetCode  = nanoid();
  const user =await userModel.findOneAndUpdate({email:email.toLowerCase()},{forgetCode } , {new : true});
  if(!user){
    return next(new Error("invalid Email" ,{cause :404}))
  }
  const html = `<h2>${forgetCode}</h2>`
  if(!await sendEmail({to : email ,subject :"update Password" , html}) ){
    return next(new Error("Rejected" ,{cause : 400}))
  }
  return res.status(200).json({message : "Done"})
})
export const forgetPassword = asyncHandler(async(req,res,next)=>{
  const {forgetCode , password, email} = req.body;
  const user = await userModel.findOne({email:email.toLowerCase()});
  if(!user){
    return next(new Error("invalid Email" ,{cause :404}))

  }
  if(user.forgetCode != forgetCode){
    return next(new Error("invalid code" ,{cause :400}))

  }
  user.password = hash({plaintext : password});
  user.forgetCode = null;
  user.changePasswordDate =  Date.now();
  await user.save();
  return res.status(200).json({message : "Done"})

})