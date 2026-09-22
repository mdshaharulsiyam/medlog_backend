import z from "zod";

const create = z.object({
  body: z
    .object({
      email: z
        .email({ pattern: z.regexes.email })
        .min(1, 'email is required"')
        .trim()
        .toLowerCase(),
    })
    .strict(),
});

const verify = z.object({
  body: z
    .object({
      email: z
        .email({ pattern: z.regexes.email })
        .min(1, 'email is required"')
        .trim()
        .toLowerCase(),
      otp: z.string("otp is required").min(1, "otp is required"),
    })
    .strict(),
});

const otpValidation = Object.freeze({
  create,
  verify,
});
export default otpValidation;