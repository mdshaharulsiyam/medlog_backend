import { pool } from "../../db/connectDB.ts";
import type {
  CreateUsersSpecialtyInput,
  UpdateUsersSpecialtyInput,
} from "./users_specialty.types.ts";

const create = async (body: CreateUsersSpecialtyInput) => {
  const { title, description } = body;
  const query = `
    INSERT INTO users_specialties (title, description)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const result = await pool.query(query, [title, description || null]);
  return {
    success: true,
    message: "UsersSpecialty created successfully",
    data: result.rows[0],
  };
};

const getAll = async () => {
  const query = `SELECT * FROM users_specialties ORDER BY id DESC;`;
  const result = await pool.query(query);
  return {
    success: true,
    message: "UsersSpecialty list retrieved successfully",
    data: result.rows,
  };
};

const getById = async (id: string | number) => {
  const query = `SELECT * FROM users_specialties WHERE id = $1 LIMIT 1;`;
  const result = await pool.query(query, [id]);
  if (result.rowCount === 0) {
    return {
      success: false,
      message: "UsersSpecialty not found",
    };
  }
  return {
    success: true,
    message: "UsersSpecialty retrieved successfully",
    data: result.rows[0],
  };
};

const update = async (id: string | number, body: UpdateUsersSpecialtyInput) => {
  const { title, description, is_active } = body;
  const query = `
    UPDATE users_specialties
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
      message: "UsersSpecialty not found",
    };
  }
  return {
    success: true,
    message: "UsersSpecialty updated successfully",
    data: result.rows[0],
  };
};

const remove = async (id: string | number) => {
  const query = `DELETE FROM users_specialties WHERE id = $1 RETURNING *;`;
  const result = await pool.query(query, [id]);
  if (result.rowCount === 0) {
    return {
      success: false,
      message: "UsersSpecialty not found",
    };
  }
  return {
    success: true,
    message: "UsersSpecialty deleted successfully",
    data: result.rows[0],
  };
};

const usersSpecialtyService = Object.freeze({
  create,
  getAll,
  getById,
  update,
  remove,
});

export default usersSpecialtyService;
