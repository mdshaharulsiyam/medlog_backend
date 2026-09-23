import express from "express";
import asyncWrapper from "../../utils/asyncWrapper.ts";
import validateRequest from "../../middlewares/validateRequest.ts";
import usersSpecialtyController from "./users_specialty.controller.ts";
import usersSpecialtyValidation from "./users_specialty.validation.ts";

const usersSpecialtyRoute = express.Router();

usersSpecialtyRoute
  .post(
    "/",
    validateRequest(usersSpecialtyValidation.create),
    asyncWrapper(usersSpecialtyController.create),
  )
  .get("/", asyncWrapper(usersSpecialtyController.getAll))
  .get("/:id", asyncWrapper(usersSpecialtyController.getById))
  .patch(
    "/:id",
    validateRequest(usersSpecialtyValidation.update),
    asyncWrapper(usersSpecialtyController.update),
  )
  .delete("/:id", asyncWrapper(usersSpecialtyController.remove));

export default usersSpecialtyRoute;
