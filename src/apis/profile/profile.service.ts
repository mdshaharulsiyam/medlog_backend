import { pool } from "../../db/connectDB.ts";
import type {
IProfile,
} from "./profile.types.ts";

const create = async (body: IProfile) => {
  const { user_id, phone, first_name, last_name, gender, years_of_experience, date_of_birth } = body;
  const query = `
    INSERT INTO profile (user_id, phone, first_name, last_name, gender, years_of_experience, date_of_birth)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (user_id) DO UPDATE SET
      phone = EXCLUDED.phone,
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      gender = EXCLUDED.gender,
      years_of_experience = EXCLUDED.years_of_experience,
      date_of_birth = EXCLUDED.date_of_birth
    RETURNING *;
  `;
  const result = await pool.query(query, [user_id, phone, first_name, last_name, gender || null, years_of_experience || null, date_of_birth || null]);
  return {
    success: true,
    message: "Profile created successfully",
    data: result.rows[0],
  };
};

const getAll = async () => {
  const query = `SELECT * FROM profiles ORDER BY id DESC;`;
  const result = await pool.query(query);
  return {
    success: true,
    message: "Profile list retrieved successfully",
    data: result.rows,
  };
};

const getById = async (id: string | number) => {
  const query = `SELECT * FROM profiles WHERE id = $1 LIMIT 1;`;
  const result = await pool.query(query, [id]);
  if (result.rowCount === 0) {
    return {
      success: false,
      message: "Profile not found",
    };
  }
  return {
    success: true,
    message: "Profile retrieved successfully",
    data: result.rows[0],
  };
};

const update = async (id: string | number, body: IProfile) => {
  const { user_id, phone, first_name, last_name, gender, years_of_experience, date_of_birth } = body;
  const query = `
    UPDATE profiles
    SET 
      user_id = COALESCE($1, user_id),
      phone = COALESCE($2, phone),
      first_name = COALESCE($3, first_name),
      last_name = COALESCE($4, last_name),
      gender = COALESCE($5, gender),
      years_of_experience = COALESCE($6, years_of_experience),
      date_of_birth = COALESCE($7, date_of_birth),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $8
    RETURNING *;
  `;
  const result = await pool.query(query, [
    user_id ?? null,
    phone ?? null,
    first_name ?? null,
    last_name ?? null,
    gender ?? null,
    years_of_experience ?? null,
    date_of_birth ?? null,
    id,
  ]);
  if (result.rowCount === 0) {
    return {
      success: false,
      message: "Profile not found",
    };
  }
  return {
    success: true,
    message: "Profile updated successfully",
    data: result.rows[0],
  };
};

const remove = async (id: string | number) => {
  const query = `DELETE FROM profiles WHERE id = $1 RETURNING *;`;
  const result = await pool.query(query, [id]);
  if (result.rowCount === 0) {
    return {
      success: false,
      message: "Profile not found",
    };
  }
  return {
    success: true,
    message: "Profile deleted successfully",
    data: result.rows[0],
  };
};

const profileService = Object.freeze({
  create,
  getAll,
  getById,
  update,
  remove,
});

export default profileService;
