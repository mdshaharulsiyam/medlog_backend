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
