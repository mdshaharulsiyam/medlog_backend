import { pool } from "../../db/connectDB.ts";
import type { CreateOtp } from "./otp.types.ts";

const create = async (body: CreateOtp) => {
    const { email } = body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const query = `INSERT INTO otp (email,otp)
    VALUES ($1, $2)
    ON CONFLICT (email)
    DO UPDATE SET otp = EXCLUDED.otp, created_at = NOW()`;
   await pool.query(query, [email, otp]);
   return {
     success: true,
     message: "otp created successfully",
   };
};


  const otpService = Object.freeze({
    create,
  });
  export default otpService;