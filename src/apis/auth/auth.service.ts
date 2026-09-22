import { pool } from "../../db/connectDB.ts";
import { secrets } from "../../secrets/secrets.ts";
import hashText, { compare } from "../../utils/hashText.ts";
import otpService from "../otp/otp.service.ts";
import type { ChangePasswordData, SignInData, SignUpData } from "./auth.types.ts";
import jwt from "jsonwebtoken";
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
  const getExistingQuery = `SELECT * FROM users WHERE email = $1 LIMIT 1`;
  const result = await pool.query(getExistingQuery, [email]);
  if (result?.rowCount === 0) {
    return {
      success: false,
      message: "invalid email or password",
    };
  }
  const { id, role, username, is_verified, is_blocked, img } = result?.rows[0];


  const isPasswordMatch = await compare(password, result?.rows[0].password);
  if (!isPasswordMatch) {
    return {
      success: false,
      message: "invalid email or password",
    };
  }
  if (is_verified === false) {
    otpService.create({ email });
    return {
      success: false,
      message: "account not verified",
      note: "please verify your account before login",
    };
  }
  if (is_blocked === true) {
    return {
      success: false,
      message: "account blocked",
      note: "please contact support for more information",
    };
  }



  const token = jwt.sign(
    {
      email: email,
      id: id,
      role: role,
      username: username,
    },
    secrets.ACCESS_TOKEN_SECRET || "duhal_access_token_secret",
    { expiresIn: 60 * 60 * 24 * 500 },
  );

  return {
    success: true,
    message: "authenticated successfully",
    note: "you are logged in now",
    data: {
      id,
      email,
      role,
      username,
      is_verified,
      is_blocked,
      img,
    },
    token,
  };
};

const ChangePassword = async (body: ChangePasswordData) => {

};

const authService = Object.freeze({
  SignUp,
  Login,
});
export default authService;
