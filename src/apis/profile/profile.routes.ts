import express from "express";
import asyncWrapper from "../../utils/asyncWrapper.ts";
import validateRequest from "../../middlewares/validateRequest.ts";
import profileController from "./profile.controller.ts";
import profileValidation from "./profile.validation.ts";
import verifyToken from "../../middlewares/verifyToken.ts";
import { secrets } from "../../secrets/secrets.ts";

const profileRoute = express.Router();

profileRoute
  .patch(
    "/",
    validateRequest(profileValidation.create),
    verifyToken(secrets.USER),
    asyncWrapper(profileController.create),
  )
  .get("/", asyncWrapper(profileController.getAll))
  .get("/:id", asyncWrapper(profileController.getById))
  .patch(
    "/:id",
    validateRequest(profileValidation.update),
    asyncWrapper(profileController.update),
  )
  .delete("/:id", asyncWrapper(profileController.remove));

export default profileRoute;
