import express, { type Express } from "express";
import { requestLogger } from "./logger.ts";
import helmet from "helmet";
import cors from "cors";
import { corsOptions } from "./corsOptions.ts";
import { requestRateLimit } from "./rateLimit.ts";
import path from "node:path";

export const applyMiddleWare = (app: Express) => {
  app.use(requestLogger);
  app.use(cors(corsOptions));
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          frameAncestors: ["'none'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
        },
      },

      crossOriginOpenerPolicy: {
        policy: "same-origin",
      },

      crossOriginResourcePolicy: {
        policy: "same-origin",
      },

      originAgentCluster: true,

      referrerPolicy: {
        policy: "strict-origin-when-cross-origin",
      },

      strictTransportSecurity: {
        maxAge: 31536000,
        includeSubDomains: true,
      },

      xContentTypeOptions: true,

      xFrameOptions: {
        action: "deny",
      },
    }),
  );
  app.disable("x-powered-by");
  app.use(
    express.json({
      limit: "1mb",
    }),
  );
  app.use(requestRateLimit);
  app.use(
  "/uploads",
  express.static(path.resolve(process.cwd(), "uploads"), {
    dotfiles: "deny",
    fallthrough: false,
    maxAge: "7d",
  }),
);
};
