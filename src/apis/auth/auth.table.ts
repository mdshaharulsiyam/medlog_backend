import { pool } from "../../db/connectDB.ts";
const authTable = async () => {
  console.log("creating user table");
  const query = `
    DO $$
    BEGIN
      CREATE TYPE user_role AS ENUM ('user', 'doctor', 'admin');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END
    $$;
    CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    img TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_blocked BOOLEAN DEFAULT FALSE,
    role user_role DEFAULT 'user'  NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
    `;
  await pool.query(query);
  console.log("user table created");
};

export default authTable;
