import db from '../config/database/connection.js';
import { QueryResult } from 'pg';
import UserRole from '../types/UserRole.js';
import { z } from 'zod';
import userRoleSchemas from '../schemas/userRole.schemas.js';

const findAll = (): Promise<QueryResult<UserRole>> =>
  db.query(
    `
      SELECT * FROM user_roles;
    `
  );

const findBySlug = ({ slug }: z.infer<typeof userRoleSchemas.findBySlug>): Promise<QueryResult<UserRole>> =>
  db.query(
    `
      SELECT * FROM user_roles WHERE slug = $1;
    `,
    [slug]
  );

const create = ({ name, slug }: z.infer<typeof userRoleSchemas.create>) =>
  db.query(
    `
      INSERT INTO user_roles (name, slug)
      VALUES ($1, $2);
    `,
    [name, slug]
  );

export default { findAll, findBySlug, create };
