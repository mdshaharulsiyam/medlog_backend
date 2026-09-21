import { pool } from "../../db/connectDB.ts";
import hashText from "../../utils/hashText.ts";
import otpService from "../otp/otp.service.ts";
import type { SignUpData } from "./auth.types.ts";


const SignUp = async (body: SignUpData) => {

  const { email, password, username } = body;

  const getExistingQuery = `
    SELECT * FROM users WHERE email = $1 LIMIT 1
    `;

  const existingUser = await pool.query(getExistingQuery, [email]);
  if (existingUser?.rowCount == 0) {
    
        const insertQuery = `
            INSERT INTO users (username,email,password,role)
            VALUES ($1,$2,$3,$4)`;

        const createUser = await pool.query(insertQuery, [
          username,
          email,
          await hashText(password),
          "user",
        ]);
        if (createUser) {
            const otp = await otpService.create({ email }); 
          return {
            success: true,
            message: "account created successfully",
            note: "please verify your account before login",
            otp,
          };
        }
  }
  await otpService.create({ email }); 
  return {
    success: true,
    message: "existing user ",
    data: existingUser?.rows,
  };
};

const authService = Object.freeze({
  SignUp,
});
export default authService;
