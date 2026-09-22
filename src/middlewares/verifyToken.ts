import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { httpStatus, secrets } from "../secrets/secrets.ts";
import { pool } from "../db/connectDB.ts";

interface DecodedToken extends JwtPayload {
    id?: number | string;
    email?: string;
    role?: string;
    username?: string;
}

const verifyToken = (
    allowedRoles: string[] = [],
    privet: boolean = true,
    type: string = secrets.TOKEN_NAME as string,
    fn?: (req: Request) => any,
) => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            let tokenWithBearer = req.headers.authorization || req.cookies?.[type];
            if (!tokenWithBearer && !privet) {
                return next();
            }

            if (!tokenWithBearer) {
                res
                    .status(httpStatus.FORBIDDEN)
                    .send({ success: false, message: "Forbidden access" });
                return;
            }

            let token: string;
            if (tokenWithBearer.startsWith("Bearer ")) {
                token = tokenWithBearer.split(" ")[1];
            } else {
                token = tokenWithBearer;
            }

            jwt.verify(
                token,
                secrets.ACCESS_TOKEN_SECRET || "duhal_access_token_secret",
                async (err, decoded) => {
                    if (err) {
                        res
                            .status(httpStatus.UNAUTHORIZED)
                            .send({ success: false, message: "Unauthorized access" });
                        return;
                    }

                    const decodedToken = decoded as DecodedToken;

                    try {
                        const [userResult, extra] = await Promise.all([
                            pool.query("SELECT * FROM users WHERE id = $1 LIMIT 1", [
                                decodedToken.id,
                            ]),
                            fn ? fn(req) : Promise.resolve({}),
                        ]);

                        const user = userResult?.rows?.[0];

                        if (!user) {
                            if (privet) {
                                res
                                    .status(httpStatus.BAD_REQUEST)
                                    .send({ success: false, message: "Unauthorized access" });
                                return;
                            } else {
                                return next();
                            }
                        }

                        if (user.is_blocked) {
                            res
                                .status(httpStatus.UNAUTHORIZED)
                                .send({ success: false, message: "You are blocked by admin" ,note: "please contact support for more information"});
                            return;
                        }

                        if (!user.is_verified) {
                            res
                                .status(httpStatus.UNAUTHORIZED)
                                .send({ success: false, message: "You please verify your email",note: "please check your email for verification link"});
                            return;
                        }

                        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
                            res.status(httpStatus.FORBIDDEN).send({
                                success: false,
                                message: "Access denied: insufficient permissions",
                            });
                            return;
                        }

                        req.user = user;
                        req.extra = extra;
                        next();
                    } catch (dbError) {
                        next(dbError);
                    }
                },
            );
        } catch (error) {
            next(error);
        }
    };
};

export default verifyToken;

