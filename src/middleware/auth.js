import userModel from "../../DB/model/User.model.js";
import { verifyToken } from "../utils/GenerateAndVerifyToken.js";
import { asyncHandler } from "../utils/errorHandling.js";

export const roles = {
  Admin: "Admin",
  User: "User",
  HR: "HR",
};
// Two ways to create authintication and authorization
// !1- in the same function (Most Common)
export const auth =  (accessRoles =[] ) =>{
    return asyncHandler(async (req,res,next)=>{
        const {authorization} = req.headers;

        if(!authorization?.startsWith(process.env.BEARER_KEY)){
            return next(new Error("In-valid Bearer Key",{cause : 400}))
        }
        const token = authorization.split(process.env.BEARER_KEY)[1];
       
        if(!token){
            return next(new Error("In-valid token",{cause : 400}))
        }
        const decoded = verifyToken({token});
        if(!decoded?._id){
            return next(new Error("In-valid token payload",{cause : 400}))
        }
        const user = await userModel.findById(decoded._id).select("userName image role changePasswordDate")
        if(!user){
            return next(new Error("Not registered user",{cause : 401}))
        }
        // console.log({token : decoded.iat , changePassTime : parseInt(user.changePasswordDate.getTime() / 1000)});
        if(  parseInt(user.changePasswordDate?.getTime() / 1000) > decoded.iat ){
            return next(new Error("Expired Token",{cause : 400}))

        }
        if(!accessRoles.includes(user.role)){
            return next(new Error("Not Authorized User",{cause : 403}))
        }
        req.user = user;
        return next()

    })
}
// !2- seperate functions
// export const auth = asyncHandler(async (req, res, next) => {
//   const { authorization } = req.headers;

//   if (!authorization?.startsWith(process.env.BEARER_KEY)) {
//     return next(new Error("In-valid Bearer Key", { cause: 400 }));
//   }
//   const token = authorization.split(process.env.BEARER_KEY)[1];
//   console.log(token);
//   if (!token) {
//     return next(new Error("In-valid token", { cause: 400 }));
//   }
//   const decoded = verifyToken({ token });
//   if (!decoded?._id) {
//     return next(new Error("In-valid token payload", { cause: 400 }));
//   }
//   const user = await userModel
//     .findById(decoded._id)
//     .select("userName image role");
//   if (!user) {
//     return next(new Error("Not registered user", { cause: 401 }));
//   }

//   req.user = user;
//   return next();
// });
// export const authorized = (accessRoles = []) => {
//   return(req,res,next)=>{
//     if (!accessRoles.includes(req.user.role)) {
//         return next(new Error("Not Authorized User", { cause: 403 }));
//       }
//       return next();
//   }
// };
