import { pool } from "../../db/connectDB.ts";
import type {
  CreateUsersSpecialtyInput,
} from "./users_specialty.types.ts";


const create = async (body: CreateUsersSpecialtyInput,user_id: string | number) => {
  const profileQuery = `SELECT id FROM profile WHERE user_id = $1 LIMIT 1;`;
  const profileResult = await pool.query(profileQuery, [user_id]);
  if (profileResult.rowCount === 0) {
    return {
      success: false,
      message: "Profile not found for the user",
      note: "Please create a profile before adding a specialty",
    };
  }
  const profile_id = profileResult.rows[0].id;
  const { specialty_id } = body;
  const query = `
    INSERT INTO users_specialty (specialty_id, profile_id)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const result = await pool.query(query, [specialty_id, profile_id]);
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

const update = async (id: string | number, body: CreateUsersSpecialtyInput) => {
  const { specialty_id, profile_id } = body;
  const query = `
    UPDATE users_specialties
    SET 
      specialty_id = COALESCE($1, specialty_id),
      profile_id = COALESCE($2, profile_id),
      is_active = COALESCE($3, is_active),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $4
    RETURNING *;
  `;
  const result = await pool.query(query, [
    specialty_id ?? null,
    profile_id ?? null,
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
