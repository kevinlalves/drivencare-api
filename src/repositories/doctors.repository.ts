import { z } from 'zod';
import db from '../config/database/connection.js';
import usersRepository from './users.repository.js';
import doctorSchemas from '../schemas/doctor.schemas.js';

const create = async ({
  name,
  roleId,
  email,
  password,
  document,
  phone,
  license_number,
  specialties,
}: z.infer<typeof doctorSchemas.signUp> & { roleId: string }) => {
  const dbClient = await db.connect();

  try {
    await dbClient.query('BEGIN;');

    await usersRepository.create({ name, roleId, email, password, document, phone }, dbClient);
    dbClient.query(
      `
      `,
      [license_number, specialties]
    );

    await dbClient.query('COMMIT;');
  } catch (err) {
    await dbClient.query('ROLLBACK;');
    throw err;
  } finally {
    dbClient.release();
  }
};

export default { create };
