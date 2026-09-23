import express from "express";
import asyncWrapper from "../../utils/asyncWrapper.ts";
import validateRequest from "../../middlewares/validateRequest.ts";
import specialtyController from "./specialty.controller.ts";
import specialtyValidation from "./specialty.validation.ts";
import verifyToken from "../../middlewares/verifyToken.ts";
import { secrets } from "../../secrets/secrets.ts";

const specialtyRoute = express.Router();

specialtyRoute
  .post(
    "/",
    validateRequest(specialtyValidation.create),
    verifyToken(secrets.USER),
    asyncWrapper(specialtyController.create),
  )
  .get("/", asyncWrapper(specialtyController.getAll))
  // .get("/:id", asyncWrapper(specialtyController.getById))
  .patch(
    "/:id",
    validateRequest(specialtyValidation.create),
    asyncWrapper(specialtyController.update),
  )
  .delete("/:id", asyncWrapper(specialtyController.remove));

export default specialtyRoute;
