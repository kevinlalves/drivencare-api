import { z } from 'zod';
import db from '../config/database/connection.js';
import userSchemas from '../schemas/user.schemas.js';
import { PoolClient, QueryResult } from 'pg';
import User from '../types/User.js';

const findAll = (): Promise<QueryResult<User>> =>
  db.query(
    `
      SELECT * FROM users;
    `
  );

const findByUniqueInfo = ({ email, document, phone }: { [key: string]: string }): Promise<QueryResult<User>> =>
  db.query(
    `
      SELECT * FROM users
      WHERE email = $1
      OR document = $2
      OR phone = $3;
    `,
    [email, document, phone]
  );

const findByEmail = ({ email }: z.infer<typeof userSchemas.findByEmail>): Promise<QueryResult<User>> =>
  db.query(
    `
      SELECT
        id,
        name,
        email,
        password,
        document,
        created_at AS "createdAt",
        updated_at AS "updatedAt",
        picture,
        phone,
        role_slug AS "roleSlug"
      FROM users
      WHERE email = $1;
    `,
    [email]
  );

const findById = ({ id }: z.infer<typeof userSchemas.findById>): Promise<QueryResult<User>> =>
  db.query(
    `
      SELECT
        id,
        name,
        email,
        password,
        document,
        created_at AS "createdAt",
        updated_at AS "updatedAt",
        picture,
        phone,
        role_slug AS "roleSlug"
      FROM users
      WHERE id = $1;
    `,
    [id]
  );

const findDoctorId = ({ userId }: { userId: string }): Promise<QueryResult<{ doctorId: string }>> =>
  db.query(
    `
      SELECT
        doctors.id AS "doctorId"
      FROM doctors
      JOIN users
      ON users.id = doctors.user_id
      WHERE users.id = $1;
    `,
    [userId]
  );

const create = (
  { name, roleSlug, email, password, document, phone }: z.infer<typeof userSchemas.signUp> & { roleSlug: string },
  dbClient: PoolClient
): Promise<QueryResult<{ userId: string }>> =>
  dbClient.query(
    `
      INSERT INTO users (name, role_slug, email, password, document, phone)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id AS "userId";
      ;
    `,
    [name, roleSlug, email, password, document, phone]
  );

export default { findAll, findById, findByEmail, findByUniqueInfo, findDoctorId, create };
