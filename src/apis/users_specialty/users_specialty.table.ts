import { pool } from "../../db/connectDB.ts";

const usersSpecialtyTable = async () => {
  console.log("creating users_specialty table");
  const query = `
    CREATE TABLE IF NOT EXISTS users_specialty(
    id SERIAL PRIMARY KEY,
    profile_id INTEGER REFERENCES profile (id) ON DELETE CASCADE,
    specialty_id INTEGER REFERENCES specialties (id) ON DELETE CASCADE,
    UNIQUE(profile_id, specialty_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
  console.log("users_specialty table created");
};

export default usersSpecialtyTable;
