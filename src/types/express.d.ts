import { Request } from "express";
declare global {
  namespace Express {
    interface Request {
      user?: any;
      extra?: any;
      cookies?: Record<string, any>;
      files?: any;
      file?: any;
    }
  }
}


