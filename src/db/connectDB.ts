import { Pool } from "pg";
import { secrets } from "../secrets/secrets.ts";
import authTable from "../apis/auth/auth.table.ts";
import otpTable from "../apis/otp/otp.table.ts";
import specialtyTable from "../apis/specialty/specialty.table.ts";
import profileTable from "../apis/profile/profile.table.ts";

export const pool = new Pool({
  connectionString: secrets.db,
  max: 20,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});
export const checkDatabaseConnection = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("PostgreSQL connected successfully");
    try {
      authTable();
      otpTable();
      specialtyTable();
      profileTable();
    } catch (error) {
      console.error(error);
      console.log("error creating tables");
    }
  } catch (error) {
    console.error("PostgreSQL connection failed:", error);
    process.exit(1);
  }
};
