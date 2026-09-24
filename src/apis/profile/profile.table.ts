import { pool } from "../../db/connectDB.ts";

const profileTable = async () => {
  console.log("creating profile table");
  const query = `
  DO
$$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gender') THEN
        CREATE TYPE gender AS ENUM ('male', 'female', 'other');
    END IF;
END
$$;
   CREATE TABLE IF NOT EXISTS profile(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,
    phone INT UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    gender gender DEFAULT 'other',
    years_of_experience DATE DEFAULT CURRENT_DATE,
    date_of_birth DATE DEFAULT CURRENT_DATE
);
  `;
  await pool.query(query);
  console.log("profile table created");
};

export default profileTable;
