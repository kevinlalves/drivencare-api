import { z } from 'zod';
import patientSchemas from '../schemas/patient.schemas.js';
import db from '../config/database/connection.js';
import usersRepository from './users.repository.js';
import { standardUserBach } from '../utils/constants/queries.js';
import { QueryResult } from 'pg';
import Patient from '../types/Patient.js';

const findAll = ({
  per = standardUserBach,
  page = 1,
}: z.infer<typeof patientSchemas.findAll>): Promise<QueryResult<Patient>> =>
  db.query(
    `
      SELECT
        patients.id,
        json_build_object(
          'id', users.id,
          'name', users.name,
          'email', users.email,
          'document', users.document,
          'picture', users.picture,
          'phone', users.phone,
          'createdAt', users.created_at,
          'updatedAt', users.updated_at
        ),
        patients.emergency_contact_name AS "emergencyContactName",
        patients.emergency_contact_phone AS "emergencyContactPhone",
        patients.insurance_provider AS "insuranceProvider",
        patients.insurance_number AS "insuranceNumber",
        patients.allergies,
        COALESCE(COUNT(appointments.id), 0) AS "appointmentsCount",
        COALESCE(COUNT(appointments.review), 0) AS "reviewsCount",
        AVG(appointments.rating) AS "averageRateGiven",
        patients.updated_at AS "updatedAt"
      FROM patients
      JOIN users
      ON patients.user_id = users.id
      LEFT JOIN appointments
      ON patients.id = appointments.patient_id
      GROUP BY patients.id, users.id
      OFFSET $1
      LIMIT $2;
    `,
    [per * (page - 1), per]
  );

const create = async ({
  name,
  email,
  password,
  document,
  phone,
  emergencyContactName,
  emergencyContactPhone,
  insuranceNumber,
  insuranceProvider,
  allergies,
  roleSlug,
}: z.infer<typeof patientSchemas.signUp> & { roleSlug: string }) => {
  const dbClient = await db.connect();

  try {
    await dbClient.query('BEGIN;');

    const {
      rows: [{ userId }],
    } = await usersRepository.create({ name, roleSlug, email, password, document, phone }, dbClient);

    await dbClient.query(
      `
        INSERT INTO patients
        (user_id, emergency_contact_name, emergency_contact_phone, insurance_provider, insurance_number, allergies)
        VALUES ($1, $2, $3, COALESCE($4, NULL), COALESCE($5, NULL), $6);
      `,
      [userId, emergencyContactName, emergencyContactPhone, insuranceProvider, insuranceNumber, allergies]
    );

    await dbClient.query('COMMIT;');
  } catch (err) {
    await dbClient.query('ROLLBACK;');
    throw err;
  } finally {
    dbClient.release();
  }
};

export default { findAll, create };
