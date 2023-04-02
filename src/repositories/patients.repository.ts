import { z } from 'zod';
import patientSchemas from '../schemas/patient.schemas.js';
import db from '../config/database/connection.js';
import usersRepository from './users.repository.js';
import { standardUserBach } from '../utils/constants/queries.js';
import { QueryResult } from 'pg';
import Patient from '../types/Patient.js';
import Appointment from '../types/Appointment.js';

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

const findAllAppointments = ({
  userId,
  per = standardUserBach,
  page = 1,
}: z.infer<typeof patientSchemas.findAllAppointments> & { userId: string }): Promise<QueryResult<Appointment>> =>
  db.query(
    `
      SELECT
        appointments.id,
        users.name AS "doctorName",
        specialties.name AS specialty,
        weekly_schedules.day_of_week AS "dayOfWeek",
        weekly_schedules.start_time AS "startTime",
        weekly_schedules.end_time AS "endTime",
        appointments.date,
        appointments.status,
        appointments.rating,
        appointments.review,
        appointments.created_at AS "createdAt",
        appointments.finished_at AS "finishedAt"
      FROM appointments
      JOIN patients
      ON patients.id = appointments.patient_id
      JOIN weekly_schedules
      ON weekly_schedules.id = appointments.weekly_schedule_id
      JOIN doctor_specialties
      ON doctor_specialties.id = weekly_schedules.doctor_specialty_id
      JOIN specialties
      ON specialties.id = doctor_specialties.specialty_id
      JOIN doctors
      ON doctors.id = doctor_specialties.doctor_id
      JOIN users
      ON doctors.user_id = users.id
      WHERE patients.user_id = $1
      OFFSET $2
      LIMIT $3;
    `,
    [userId, per * (page - 1), per]
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

const createAppointment = async ({
  patientId,
  weeklyScheduleId,
  date,
}: z.infer<typeof patientSchemas.createAppointment> & { patientId: string }) =>
  db.query(
    `
      INSERT INTO appointments
      (patient_id, weekly_schedule_id, date)
      VALUES ($1, $2, $3);
    `,
    [patientId, weeklyScheduleId, date]
  );

export default { findAll, findAllAppointments, create, createAppointment };
