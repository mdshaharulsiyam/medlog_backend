import { pool } from "../../db/connectDB.ts";
import hashText from "../../utils/hashText.ts";
import otpService from "../otp/otp.service.ts";
import type { SignInData, SignUpData } from "./auth.types.ts";

const SignUp = async (body: SignUpData) => {
  const { email, password, username } = body;

  const getExistingQuery = `SELECT * FROM users WHERE email = $1 LIMIT 1`;

  const existingUser = await pool.query(getExistingQuery, [email]);

  if (existingUser?.rowCount == 0) {
    const insertQuery = `INSERT INTO users (username,email,password,role) VALUES ($1,$2,$3,$4)`;

    await pool.query(insertQuery, [
      username,
      email,
      await hashText(password),
      "user",
    ]);

    otpService.create({ email });
    return {
      success: true,
      message: "account created successfully",
      note: "please verify your account before login",
    };
  }

  if (
    existingUser?.rowCount !== 0 &&
    existingUser?.rows[0].is_verified === false
  ) {
     otpService.create({ email });
  }
  return {
    success: true,
    message: "account created successfully",
    note: "please verify your account before login",
  };
};

const Login = async (body: SignInData) => {

  const { email, password } = body;
  const passwordHash = await hashText(password);
  const getExistingQuery = `SELECT * FROM users WHERE email = $1 AND password =$2 LIMIT 1`;
  const result = await pool.query(getExistingQuery, [email, passwordHash]);
  if (result?.rowCount === 0) {
    return {
      success: false,
      message: "invalid email or password",
    };
  }
  if (result?.rows[0].is_verified === false) {
    otpService.create({ email });
    return {
      success: false,
      message: "account not verified",
      note: "please verify your account before login",
    };
  }
  if (result?.rows[0].is_blocked === true) {
    return {
      success: false,
      message: "account blocked",
      note: "please contact support for more information",
    };
  }
  return {
    success: true,
    message: "login successful",
    data: result?.rows[0],
  };

}

const authService = Object.freeze({
  SignUp,
});
export default authService;
