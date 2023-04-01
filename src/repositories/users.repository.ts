import { z } from 'zod';
import db from '../config/database/connection.js';
import userSchemas from '../schemas/user.schemas.js';
import { PoolClient, QueryResult } from 'pg';
import User from '../types/User.js';

const findByEmail = (email: string): Promise<QueryResult<User>> =>
  db.query(
    `
      SELECT * FROM users WHERE email = $1;
    `,
    [email]
  );

const create = (
  { name, roleId, email, password, document, phone }: z.infer<typeof userSchemas.signUp> & { roleId: string },
  dbClient: PoolClient
) =>
  dbClient.query(
    `
      INSERT INTO users (name, role_id, email, password, document, phone)
      VALUES ($1, $2, $3, $4, $5, $6);
    `,
    [name, roleId, email, password, document, phone]
  );

export default { findByEmail, create };
