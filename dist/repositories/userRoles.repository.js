import db from '../config/database/connection.js';
const findAll = () => db.query(`
      SELECT * FROM user_roles;
    `);
const findBySlug = ({ slug }) => db.query(`
      SELECT * FROM user_roles WHERE slug = $1;
    `, [slug]);
const create = ({ name, slug }) => db.query(`
      INSERT INTO user_roles (name, slug)
      VALUES ($1, $2);
    `, [name, slug]);
export default { findAll, findBySlug, create };
