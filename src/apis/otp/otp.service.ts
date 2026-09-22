import { pool } from "../../db/connectDB.ts";
import { secrets } from "../../secrets/secrets.ts";
import { sendMail } from "../../utils/sendMail.ts";
import type { CreateOtp, VerifyOtp } from "./otp.types.ts";
import jwt from "jsonwebtoken";

const create = async (
  body: CreateOtp,
  from: "server" | "client" = "server",
) => {
  const { email } = body;
  if (from === "client") {
    const query = `SELECT * FROM users WHERE email = $1 LIMIT 1`;
    const existingUser = await pool.query(query, [body.email]);
    if (existingUser?.rowCount === 0) {
      return {
        success: false,
        message: "user not found",
      };
    }
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const query = `INSERT INTO otp (email,otp)
    VALUES ($1, $2)
    ON CONFLICT (email)
    DO UPDATE SET otp = EXCLUDED.otp, created_at = NOW()`;

  await pool.query(query, [email, otp]);
  console.log(otp);
  await sendMail.sendVerificationMail(
    email,
    "Your Verification Code",
    "User",
    otp,
  );
  return {
    success: true,
    message: "otp created successfully",
  };
};

const verify = async (body: VerifyOtp) => {
  const { email, otp } = body;
  const query = `SELECT * FROM otp WHERE email = $1 AND otp = $2 AND created_at >= NOW() - INTERVAL '5 minutes'`;
  const result = await pool.query(query, [email, otp]);

  if (result?.rowCount === 0) {
    return {
      success: false,
      message: "invalid otp",
    };
  }
  const updateQuery = `UPDATE users SET is_verified = TRUE WHERE email = $1`;
  const selectQuery = `SELECT * FROM users WHERE email = $1 LIMIT 1`;
  const [user] = await Promise.all([
    pool.query(selectQuery, [email]),
    pool.query(updateQuery, [email]),
  ])

if (user?.rows[0]?.is_blocked === true) {
  return {
    success: false,
    message: "account blocked",
    note: "please contact support for more information",
  };
}

  const password_reset_token = jwt.sign(
    {
      email,
      code: otp,
    },
    secrets.ACCESS_TOKEN_SECRET || "duhal_access_token_secret",
    { expiresIn: 5 * 60 },
  );
  const token = jwt.sign(
    {
      email: email,
      id: user?.rows[0]?.id,
      role: user?.rows[0]?.role,
      username: user?.rows[0]?.username,
    },
    secrets.ACCESS_TOKEN_SECRET || "duhal_access_token_secret",
    { expiresIn: 60 * 60 * 24 * 500 },
  );
  return {
    success: true,
    message: "otp verified successfully",
    note: "your account is verified now, you can login now",
    data: {
      token,
      password_reset_token,
    },
  };
};

const otpService = Object.freeze({
  create,
  verify,
});
export default otpService;
