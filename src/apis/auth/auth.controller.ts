import type { Request, Response } from "express";
import authService from "./auth.service.ts";
import { sendResponse } from "../../utils/sendResponse.ts";
import { httpStatus, secrets } from "../../secrets/secrets.ts";

const signUp = async (req: Request, res: Response) => {
  const result = await authService.SignUp(req.body);
  sendResponse(res, httpStatus.SUCCESS, result);
};

const login = async (req: Request, res: Response) => {
  const result = await authService.Login(req.body);
  sendResponse(res, httpStatus.SUCCESS, result, [
    secrets.ACCESS_TOKEN_NAME as string,
    result?.token as string,
    60 * 3 * 1000,
  ]);
};

export const authController = Object.freeze({
  signUp,
  login,
});
