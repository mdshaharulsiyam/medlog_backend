import { pool } from "../../db/connectDB.ts";

const usersSpecialtyTable = async () => {
  console.log("creating users_specialty table");
  const query = `
    CREATE TABLE IF NOT EXISTS specialty(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    );
  `;
  await pool.query(query);
  console.log("users_specialty table created");
};

export default usersSpecialtyTable;
