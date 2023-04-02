import db from '../config/database/connection.js';
import usersRepository from './users.repository.js';
const findAll = () => db.query(`
      SELECT * FROM doctors;
    `);
const create = async ({ name, roleId, email, password, document, phone, licenseNumber, specialties, }) => {
    const dbClient = await db.connect();
    try {
        await dbClient.query('BEGIN;');
        const { rows: [{ userId }], } = await usersRepository.create({ name, roleId, email, password, document, phone }, dbClient);
        const { rows: [{ doctorId }], } = (await dbClient.query(`
        INSERT INTO doctors (user_id, license_number)
        VALUES ($1, $2)
        RETURNING id AS "doctorId";
      `, [userId, licenseNumber]));
        const doctorSpecialtiesValues = specialties.map((specialty) => `(${doctorId}${specialty.id}, ${specialty.monthsOfExperience})`);
        await dbClient.query(`
        INSERT INTO doctor_specialties (doctor_id, specialty_id, months_of_experience)
        VALUES ${doctorSpecialtiesValues.join(', ')};
      `, doctorSpecialtiesValues);
        await dbClient.query('COMMIT;');
    }
    catch (err) {
        await dbClient.query('ROLLBACK;');
        throw err;
    }
    finally {
        dbClient.release();
    }
};
export default { findAll, create };
