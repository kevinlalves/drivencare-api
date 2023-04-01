import db from '../config/database/connection.js';
import { QueryResult } from 'pg';
import UserRole from '../types/UserRole.js';

const findByName = (name: string): Promise<QueryResult<UserRole>> =>
  db.query(
    `
      SELECT * FROM user_roles WHERE name = $1;
    `,
    [name]
  );

const create = (name: string) =>
  db.query(
    `
      INSERT INTO user_roles (name)
      VALUES ($1);
    `,
    [name]
  );

export default { findByName, create };
