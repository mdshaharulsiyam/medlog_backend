import { pool } from "../../db/connectDB.ts";
import type { CreateSpecialtyInput } from "./specialty.types.ts";


const create = async (body: CreateSpecialtyInput) => {
  const { name } = body;
  const query = `
    INSERT INTO specialties (name)
    VALUES ($1)
    RETURNING *;
  `;
  const result = await pool.query(query, [name]);
  return {
    success: true,
    message: "Specialty created successfully",
    data: result.rows[0],
  };
};

const getAll = async (page: number, limit: number) => {
  const offset = (page - 1) * limit;
  const query = `SELECT id, name  FROM specialties ORDER BY id DESC LIMIT $1 OFFSET $2;`;
  const countQuery = `SELECT COUNT(*) FROM specialties;`;
  
  const [ result, countResult ] = await Promise.all([
    pool.query(query, [limit, offset]),
    pool.query(countQuery),
  ]);
  const total= Number(countResult.rows[0].count);
  return {
    success: true,
    message: "Specialty list retrieved successfully",
    data: result.rows,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getById = async (id: string | number) => {
  const query = `SELECT * FROM specialties WHERE id = $1 LIMIT 1;`;
  const result = await pool.query(query, [id]);
  if (result.rowCount === 0) {
    return {
      success: false,
      message: "Specialty not found",
    };
  }
  return {
    success: true,
    message: "Specialty retrieved successfully",
    data: result.rows[0],
  };
};

const update = async (id: string | number, body: CreateSpecialtyInput) => {
  const { name } = body;
  const query = `
    UPDATE specialties
    SET 
      name = COALESCE($1, name),
    WHERE id = $2
    RETURNING *;
  `;
  const result = await pool.query(query, [
    name ?? null,
    id,
  ]);
  if (result.rowCount === 0) {
    return {
      success: false,
      message: "Specialty not found",
    };
  }
  return {
    success: true,
    message: "Specialty updated successfully",
    data: result.rows[0],
  };
};

const remove = async (id: string | number) => {
  const query = `DELETE FROM specialties WHERE id = $1 RETURNING *;`;
  const result = await pool.query(query, [id]);
  if (result.rowCount === 0) {
    return {
      success: false,
      message: "Specialty not found",
    };
  }
  return {
    success: true,
    message: "Specialty deleted successfully",
    data: result.rows[0],
  };
};

const specialtyService = Object.freeze({
  create,
  getAll,
  getById,
  update,
  remove,
});

export default specialtyService;

  