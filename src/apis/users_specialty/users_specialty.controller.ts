import type { Request, Response } from "express";
import usersSpecialtyService from "./users_specialty.service.ts";
import { sendResponse } from "../../utils/sendResponse.ts";
import { httpStatus } from "../../secrets/secrets.ts";

const create = async (req: Request, res: Response) => {
  const user_id = req.user?.id;
  const result = await usersSpecialtyService.create(req.body, user_id);
  sendResponse(res, httpStatus.CREATED, result);
};

const getAll = async (req: Request, res: Response) => {
  const result = await usersSpecialtyService.getAll();
  sendResponse(res, httpStatus.SUCCESS, result);
};

const getById = async (req: Request, res: Response) => {
  const result = await usersSpecialtyService.getById(req.params.id?.toString());
  sendResponse(
    res,
    result.success ? httpStatus.SUCCESS : httpStatus.NOT_FOUND,
    result,
  );
};

const update = async (req: Request, res: Response) => {
  const result = await usersSpecialtyService.update(req.params.id?.toString(), req.body);
  sendResponse(
    res,
    result.success ? httpStatus.SUCCESS : httpStatus.NOT_FOUND,
    result,
  );
};

const remove = async (req: Request, res: Response) => {
  const result = await usersSpecialtyService.remove(req.params.id?.toString());
  sendResponse(
    res,
    result.success ? httpStatus.SUCCESS : httpStatus.NOT_FOUND,
    result,
  );
};

const usersSpecialtyController = Object.freeze({
  create,
  getAll,
  getById,
  update,
  remove,
});

export default usersSpecialtyController;
