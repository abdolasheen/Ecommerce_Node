import * as categoryController from "./controller/category.js";
import * as validators from "./category.validation.js";
import { validation } from "../../middleware/validation.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { Router, application } from "express";
import subcategoryRouter from "../subcategory/subcategory.router.js";
import {auth, roles} from "../../middleware/auth.js";
import { endPoint } from "./category.endPoint.js";
const router = Router();

router.use("/:categoryId/subcategory", subcategoryRouter);
router.get("/", auth(Object.values(roles)), categoryController.categoryList);

router.post(
  "/",
  auth(endPoint.create),
  fileUpload(fileValidation.image).single("image"),
  validation(validators.createCategory),
  categoryController.createCategory
);
// router.post(
//   "/",
//   auth,
//   authorized(endPoint.create),
//   fileUpload(fileValidation.image).single("image"),
//   validation(validators.createCategory),
//   categoryController.createCategory
// );

router.put(
  "/:categoryId",
  auth(endPoint.update),
  fileUpload(fileValidation.image).single("image"),
  validation(validators.updateCategory),
  categoryController.updateCategory
);

export default router;
