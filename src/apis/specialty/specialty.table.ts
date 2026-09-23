import { pool } from "../../db/connectDB.ts";

const specialtyTable = async () => {
  console.log("creating specialty table");
  const query = `
    CREATE TABLE IF NOT EXISTS specialties (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
  `;
  await pool.query(query);
  console.log("specialty table created");
};

export default specialtyTable;
