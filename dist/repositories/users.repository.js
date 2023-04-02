import db from '../config/database/connection.js';
const findAll = () => db.query(`
      SELECT * FROM users;
    `);
const findByEmail = (email) => db.query(`
      SELECT * FROM users WHERE email = $1;
    `, [email]);
const create = ({ name, roleId, email, password, document, phone }, dbClient) => dbClient.query(`
      INSERT INTO users (name, role_id, email, password, document, phone)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id AS "userId";
      ;
    `, [name, roleId, email, password, document, phone]);
export default { findAll, findByEmail, create };
