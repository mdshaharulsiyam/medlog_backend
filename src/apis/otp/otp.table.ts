import { pool } from "../../db/connectDB.ts";

const otpTable = async () => {
  console.log("creating otp table");
  const query = `
    CREATE TABLE IF NOT EXISTS otp(
    email VARCHAR(50) UNIQUE NOT NULL,
    otp INTEGER CHECK (otp BETWEEN 100000 AND 999999),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;
  await pool.query(query);
  console.log("otp table created");
};

export default otpTable;
