import { pool } from "../../db/connectDB.ts";
import type {
  CreateProfileInput,
  UpdateProfileInput,
} from "./profile.types.ts";

const create = async (body: CreateProfileInput) => {
  const { title, description } = body;
  const query = `
    INSERT INTO profiles (title, description)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const result = await pool.query(query, [title, description || null]);
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

const update = async (id: string | number, body: UpdateProfileInput) => {
  const { title, description, is_active } = body;
  const query = `
    UPDATE profiles
    SET 
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      is_active = COALESCE($3, is_active),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $4
    RETURNING *;
  `;
  const result = await pool.query(query, [
    title ?? null,
    description ?? null,
    is_active ?? null,
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
