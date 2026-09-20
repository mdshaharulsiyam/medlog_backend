import type { NextFunction, Request, Response } from "express";
import winston from "winston";

// 1. Configure the Winston Logger
export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }), 
    winston.format.json()
  ),
  
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
          const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : "";
          return `[${timestamp}] ${level}: ${message} ${metaStr} ${stack || ""}`;
        })
      ),
    }),

    new winston.transports.File({
      filename: "error.log",
      level: "error",
    }),
  ],
});

export const requestLogger = (req:Request, res:Response, next:NextFunction) => {
  const startTime = process.hrtime();

  res.on("finish", () => {
    const diff = process.hrtime(startTime);
    const durationInMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);

    logger.info("Incoming Request", {
      method: req.method,
      url: req.originalUrl,
      host: req.get("host"),
      ip: req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      statusCode: res.statusCode,
      duration: `${durationInMs} ms`,
    });
  });

  next();
};

export const errorLogger = (err:any, req:Request, res:Response, next:NextFunction) => {
  logger.error("Unhandled Application Error", {
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress,
  });

  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
};