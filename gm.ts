import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

const toCamelCase = (str: string): string => {
  return str
    .replace(/[-_ ]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^(.)/, (c) => c.toLowerCase());
};

const toPascalCase = (str: string): string => {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
};

const toSnakeCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[-\s]+/g, "_")
    .toLowerCase();
};

const toPlural = (str: string): string => {
  if (str.endsWith("s")) return str;
  if (str.endsWith("y") && !/[aeiou]y$/i.test(str)) {
    return str.slice(0, -1) + "ies";
  }
  return str + "s";
};

const generateModule = (rawName: string) => {
  const moduleName = toSnakeCase(rawName.trim());
  if (!moduleName) {
    console.error("❌ Module name cannot be empty.");
    return;
  }

  const camelName = toCamelCase(moduleName);
  const pascalName = toPascalCase(moduleName);
  const snakeName = toSnakeCase(moduleName);
  const pluralSnakeName = toPlural(snakeName);

  const targetDir = path.resolve(process.cwd(), "src", "apis", moduleName);

  if (fs.existsSync(targetDir)) {
    console.error(`❌ Directory already exists: src/apis/${moduleName}`);
    return;
  }

  fs.mkdirSync(targetDir, { recursive: true });

  // 1. types.ts
  const typesContent = `export interface I${pascalName} {
  id?: number;
  title: string;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface Create${pascalName}Input {
  title: string;
  description?: string;
}

export interface Update${pascalName}Input {
  title?: string;
  description?: string;
  is_active?: boolean;
}
`;

  // 2. validation.ts
  const validationContent = `import { z } from "zod";

const create = z.object({
  body: z.object({
    title: z.string({ error: "title is required" }).min(1, "title is required"),
    description: z.string().optional(),
  }),
});

const update = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    is_active: z.boolean().optional(),
  }),
});

const ${camelName}Validation = Object.freeze({
  create,
  update,
});

export default ${camelName}Validation;
`;

  // 3. table.ts
  const tableContent = `import { pool } from "../../db/connectDB.ts";

const ${camelName}Table = async () => {
  console.log("creating ${snakeName} table");
  const query = \`
    CREATE TABLE IF NOT EXISTS ${pluralSnakeName} (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  \`;
  await pool.query(query);
  console.log("${snakeName} table created");
};

export default ${camelName}Table;
`;

  // 4. service.ts
  const serviceContent = `import { pool } from "../../db/connectDB.ts";
import type {
  Create${pascalName}Input,
  Update${pascalName}Input,
} from "./${moduleName}.types.ts";

const create = async (body: Create${pascalName}Input) => {
  const { title, description } = body;
  const query = \`
    INSERT INTO ${pluralSnakeName} (title, description)
    VALUES ($1, $2)
    RETURNING *;
  \`;
  const result = await pool.query(query, [title, description || null]);
  return {
    success: true,
    message: "${pascalName} created successfully",
    data: result.rows[0],
  };
};

const getAll = async () => {
  const query = \`SELECT * FROM ${pluralSnakeName} ORDER BY id DESC;\`;
  const result = await pool.query(query);
  return {
    success: true,
    message: "${pascalName} list retrieved successfully",
    data: result.rows,
  };
};

const getById = async (id: string | number) => {
  const query = \`SELECT * FROM ${pluralSnakeName} WHERE id = $1 LIMIT 1;\`;
  const result = await pool.query(query, [id]);
  if (result.rowCount === 0) {
    return {
      success: false,
      message: "${pascalName} not found",
    };
  }
  return {
    success: true,
    message: "${pascalName} retrieved successfully",
    data: result.rows[0],
  };
};

const update = async (id: string | number, body: Update${pascalName}Input) => {
  const { title, description, is_active } = body;
  const query = \`
    UPDATE ${pluralSnakeName}
    SET 
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      is_active = COALESCE($3, is_active),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $4
    RETURNING *;
  \`;
  const result = await pool.query(query, [
    title ?? null,
    description ?? null,
    is_active ?? null,
    id,
  ]);
  if (result.rowCount === 0) {
    return {
      success: false,
      message: "${pascalName} not found",
    };
  }
  return {
    success: true,
    message: "${pascalName} updated successfully",
    data: result.rows[0],
  };
};

const remove = async (id: string | number) => {
  const query = \`DELETE FROM ${pluralSnakeName} WHERE id = $1 RETURNING *;\`;
  const result = await pool.query(query, [id]);
  if (result.rowCount === 0) {
    return {
      success: false,
      message: "${pascalName} not found",
    };
  }
  return {
    success: true,
    message: "${pascalName} deleted successfully",
    data: result.rows[0],
  };
};

const ${camelName}Service = Object.freeze({
  create,
  getAll,
  getById,
  update,
  remove,
});

export default ${camelName}Service;
`;

  // 5. controller.ts
  const controllerContent = `import type { Request, Response } from "express";
import ${camelName}Service from "./${moduleName}.service.ts";
import { sendResponse } from "../../utils/sendResponse.ts";
import { httpStatus } from "../../secrets/secrets.ts";

const create = async (req: Request, res: Response) => {
  const result = await ${camelName}Service.create(req.body);
  sendResponse(
    res,
    result.success ? httpStatus.CREATED : httpStatus.BAD_REQUEST,
    result,
  );
};

const getAll = async (req: Request, res: Response) => {
  const result = await ${camelName}Service.getAll();
  sendResponse(res, httpStatus.SUCCESS, result);
};

const getById = async (req: Request, res: Response) => {
  const result = await ${camelName}Service.getById(req.params.id);
  sendResponse(
    res,
    result.success ? httpStatus.SUCCESS : httpStatus.NOT_FOUND,
    result,
  );
};

const update = async (req: Request, res: Response) => {
  const result = await ${camelName}Service.update(req.params.id, req.body);
  sendResponse(
    res,
    result.success ? httpStatus.SUCCESS : httpStatus.NOT_FOUND,
    result,
  );
};

const remove = async (req: Request, res: Response) => {
  const result = await ${camelName}Service.remove(req.params.id);
  sendResponse(
    res,
    result.success ? httpStatus.SUCCESS : httpStatus.NOT_FOUND,
    result,
  );
};

const ${camelName}Controller = Object.freeze({
  create,
  getAll,
  getById,
  update,
  remove,
});

export default ${camelName}Controller;
`;

  // 6. routes.ts
  const routesContent = `import express from "express";
import asyncWrapper from "../../utils/asyncWrapper.ts";
import validateRequest from "../../middlewares/validateRequest.ts";
import ${camelName}Controller from "./${moduleName}.controller.ts";
import ${camelName}Validation from "./${moduleName}.validation.ts";

const ${camelName}Route = express.Router();

${camelName}Route
  .post(
    "/",
    validateRequest(${camelName}Validation.create),
    asyncWrapper(${camelName}Controller.create),
  )
  .get("/", asyncWrapper(${camelName}Controller.getAll))
  .get("/:id", asyncWrapper(${camelName}Controller.getById))
  .patch(
    "/:id",
    validateRequest(${camelName}Validation.update),
    asyncWrapper(${camelName}Controller.update),
  )
  .delete("/:id", asyncWrapper(${camelName}Controller.remove));

export default ${camelName}Route;
`;

  const files = [
    { name: `${moduleName}.types.ts`, content: typesContent },
    { name: `${moduleName}.validation.ts`, content: validationContent },
    { name: `${moduleName}.table.ts`, content: tableContent },
    { name: `${moduleName}.service.ts`, content: serviceContent },
    { name: `${moduleName}.controller.ts`, content: controllerContent },
    { name: `${moduleName}.routes.ts`, content: routesContent },
  ];

  files.forEach((file) => {
    fs.writeFileSync(path.join(targetDir, file.name), file.content, "utf8");
    console.log(`  ✔ Created: src/apis/${moduleName}/${file.name}`);
  });

  console.log(`\n🎉 Module "${moduleName}" generated successfully!\n`);
  console.log(`Next steps:`);
  console.log(
    `1. Import ${camelName}Route in src/middlewares/routeMiddleWare.ts:`,
  );
  console.log(
    `   app.use("/${snakeName}", ${camelName}Route);`,
  );
  console.log(`2. Import ${camelName}Table in src/db/connectDB.ts:`);
  console.log(`   ${camelName}Table();\n`);
};

// CLI Execution: node gm.ts [module_name]
const argName = process.argv[2];

if (argName) {
  generateModule(argName);
} else {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Enter module name: ", (answer) => {
    generateModule(answer);
    rl.close();
  });
}
