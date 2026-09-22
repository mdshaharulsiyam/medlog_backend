import { z } from "zod";

const signUp = z.object({
  body: z
    .object({
      username: z.string("username is required").min(1, "username is required"),
      email: z
        .email({ pattern: z.regexes.email })
        .min(1, 'email is required"')
        .trim()
        .toLowerCase(),
      password: z.string("password is required").min(1, "password is required"),
      confirmPassword: z
        .string("confirm password is required")
        .min(1, "confirm password is required"),
      img: z.string().optional(),
    })
    .strict()
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
});

const login = z.object({
  body: z
    .object({
      email: z
        .email({ pattern: z.regexes.email })
        .min(1, 'email is required"')
        .trim()
        .toLowerCase(),
      password: z.string("password is required").min(1, "password is required"),
    })
    .strict(),
});
const changePassword = z.object({
  body: z
    .object({
      oldPassword: z.string("old password is required").min(1, "old password is required"),
      password: z.string("password is required").min(1, "password is required"),
      confirmPassword: z
        .string("confirm password is required")
        .min(1, "confirm password is required"),
    })
    .strict()
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",  
      path: ["confirmPassword"],
    }),
});

const resetPassword = z.object({
  body: z
    .object({
      password: z.string("password is required").min(1, "password is required"),
      confirmPassword: z
        .string("confirm password is required")
        .min(1, "confirm password is required"),
    })
    .strict()
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
});

export const authValidation = {
  signUp,
  login,
  changePassword,
  resetPassword,
};