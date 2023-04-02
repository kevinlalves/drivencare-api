import db from '../config/database/connection.js';
const findAll = () => db.query(`
      SELECT * FROM specialties;
    `);
const findBySlugs = (slugs) => db.query(`
      SELECT * FROM specialties
      WHERE slug IN (${slugs.map((_, index) => `$${index + 1}`).join(', ')});
    `, slugs);
const findBySlug = ({ slug }) => db.query(`
      SELECT * FROM specialties WHERE slug = $1;
    `, [slug]);
const create = ({ name, slug }) => db.query(`
        INSERT INTO specialties (name, slug)
        VALUES ($1, $2);
      `, [name, slug]);
export default { findAll, findBySlugs, findBySlug, create };
