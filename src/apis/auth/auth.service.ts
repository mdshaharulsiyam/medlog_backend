import { pool } from "../../db/connectDB.ts";
import { secrets } from "../../secrets/secrets.ts";
import hashText, { compare } from "../../utils/hashText.ts";
import { sendMail } from "../../utils/sendMail.ts";
import otpService from "../otp/otp.service.ts";
import type { ChangePasswordData, SignInData, SignUpData, userType } from "./auth.types.ts";
import jwt from "jsonwebtoken";
const signUp = async (body: SignUpData) => {
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

const login = async (body: SignInData) => {
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

const changePassword = async (body: ChangePasswordData, user: userType) => {
  const { oldPassword, password, confirmPassword } = body;
    if (password !== confirmPassword) {
      return {
        success: false,
        message: "password and confirm password do not match",
      };
    }
  const isPasswordMatch = await compare(oldPassword, user.password);
  if (!isPasswordMatch) {
    return {
      success: false,
      message: "old password is incorrect",
    };
  }
  const updateQuery = `UPDATE users SET password = $1 WHERE id = $2`;
  await pool.query(updateQuery, [await hashText(password), user.id]);
  sendMail.sendPasswordChangeMail(
    user.email,
    user.username,
    "Password Changed Successfully",
  );
  return {
    success: true,
    message: "password changed successfully",
    note: "please login again with new password",
  };

};

const resetPassword = async (body: ChangePasswordData,user: userType) => {
  const { password, confirmPassword } = body;
  if (password !== confirmPassword) {
    return {
      success: false,
      message: "password and confirm password do not match",
    };
  }
  const updateQuery = `UPDATE users SET password = $1 WHERE id = $2`;
  await pool.query(updateQuery, [await hashText(password), user.id]);
  sendMail.sendPasswordChangeMail(
    user.email,
    user.username,
    "Password Reset Successfully",
  );
  return {
    success: true,
    message: "password reset successfully",
    note: "please login again with new password",
  };
}

const authService = Object.freeze({
  signUp,
  login,
  changePassword,
  resetPassword,
});
export default authService;
