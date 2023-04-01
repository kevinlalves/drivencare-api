import { QueryResult } from 'pg';
import db from '../config/database/connection.js';
import Specialty from '../types/Specialty.js';
import { z } from 'zod';
import specialtySchemas from '../schemas/specialty.schemas.js';

const findAll = (): Promise<QueryResult<Specialty>> =>
  db.query(
    `
      SELECT * FROM specialties;
    `
  );

const findBySlugs = (slugs: Array<string>): Promise<QueryResult<Specialty>> =>
  db.query(
    `
      SELECT * FROM specialties
      WHERE slug IN (${slugs.map((_, index) => `$${index + 1}`).join(', ')});
    `,
    slugs
  );

const findBySlug = ({ slug }: z.infer<typeof specialtySchemas.findBySlug>): Promise<QueryResult<Specialty>> =>
  db.query(
    `
      SELECT * FROM specialties WHERE slug = $1;
    `,
    [slug]
  );

const create = ({ name, slug }: z.infer<typeof specialtySchemas.create>) =>
  db.query(
    `
        INSERT INTO specialties (name, slug)
        VALUES ($1, $2);
      `,
    [name, slug]
  );

export default { findAll, findBySlugs, findBySlug, create };
