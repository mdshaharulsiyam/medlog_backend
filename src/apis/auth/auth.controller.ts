import type { Request, Response } from "express";
import authService from "./auth.service.ts";
import { sendResponse } from "../../utils/sendResponse.ts";
import { httpStatus, secrets } from "../../secrets/secrets.ts";

const signUp = async (req: Request, res: Response) => {
  const result = await authService.signUp(req.body);
  sendResponse(res, httpStatus.SUCCESS, result);
};

const login = async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  sendResponse(res, httpStatus.SUCCESS, result, [
    secrets.TOKEN_NAME as string,
    result?.token as string,
    60 * 3 * 1000,
  ]);
};

const changePassword = async (req: Request, res: Response) => {
  const result = await authService.changePassword(req.body, req.user);
  sendResponse(res, httpStatus.SUCCESS, result);
}

const resetPassword = async (req: Request, res: Response) => {
  const result = await authService.resetPassword(req.body, req.user);
  sendResponse(res, httpStatus.SUCCESS, result);
} 

export const authController = Object.freeze({
  signUp,
  login,
  changePassword,
  resetPassword,
});
