import { z } from 'zod';
import db from '../config/database/connection.js';
import usersRepository from './users.repository.js';
import doctorSchemas from '../schemas/doctor.schemas.js';
import { QueryResult } from 'pg';
import Doctor from '../types/Doctor.js';
import { standardUserBach } from '../utils/constants/queries.js';
import WeeklySchedule from '../types/WeeklySchedule.js';
import Appointment from '../types/Appointment.js';

const findAll = ({
  page = 1,
  per = standardUserBach,
}: z.infer<typeof doctorSchemas.findAll>): Promise<QueryResult<Doctor>> =>
  db.query(
    `
      SELECT
        doctors.id,
        json_build_object(
          'id', users.id,
          'name', users.name,
          'email', users.email,
          'document', users.document,
          'picture', users.picture,
          'phone', users.phone,
          'createdAt', users.created_at,
          'updatedAt', users.updated_at
        ) as "personalInfo",
        doctors.license_number AS "licenseNumber",
        AVG(appointments.rating) AS rating,
        COALESCE(COUNT(appointments.id), 0) AS "appointmentsCount",
        COALESCE(COUNT(appointments.review), 0) AS "reviewsCount",
        json_agg(specialties.name) AS "specialties"
      FROM doctors
      JOIN users
      ON doctors.user_id = users.id
      JOIN doctor_specialties
      ON doctors.id = doctor_specialties.doctor_id
      LEFT JOIN weekly_schedules
      ON doctor_specialties.id = weekly_schedules.doctor_specialty_id
      LEFT JOIN appointments
      ON weekly_schedules.id = appointments.weekly_schedule_id
      JOIN specialties
      ON specialties.id = doctor_specialties.specialty_id
      GROUP BY doctors.id, users.id
      OFFSET $1
      LIMIT $2;
    `,
    [per * (page - 1), per]
  );

const findAllAppointments = ({
  userId,
  per = 1,
  page = standardUserBach,
}: z.infer<typeof doctorSchemas.findAllAppointments> & { userId: string }): Promise<QueryResult<Appointment>> =>
  db.query(
    `
      SELECT
        appointments.id,
        json_build_object(
          'id', patients.id,
          'emergencyContactName', patients.emergency_contact_name,
          'emergencyContactPhone', patients.emergency_contact_phone,
          'insuranceProvider', patients.insurance_provider,
          'insuranceNumber', patients.insurance_number,
          'allergies', patients.allergies,
          'updatedAt', patients.updated_at
        ) AS patient,
        json_build_object(
          'id', weekly_schedules.id,
          'specialty', specialties.name,
          'dayOfWeek', weekly_schedules.day_of_week,
          'startTime', weekly_schedules.start_time,
          'endTime', weekly_schedules.end_time
        ) AS "weeklySchedule",
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
      ON users.id = doctors.user_id
      WHERE users.id = $1
      OFFSET $2
      LIMIT $3;
    `,
    [userId, per * (page - 1), per]
  );

const findAllWeeklySchedules = ({
  userId,
  per = standardUserBach,
  page = 1,
}: z.infer<typeof doctorSchemas.findAllWeeklySchedules> & { userId: string }): Promise<QueryResult<WeeklySchedule>> =>
  db.query(
    `
      SELECT
        weekly_schedules.id,
        json_build_object(
          'id', specialties.id,
          'name', specialties.name,
          'slug', specialties.slug
        ) AS specialty,
        weekly_schedules.day_of_week AS "dayOfWeek",
        weekly_schedules.start_time AS "startTime",
        weekly_schedules.end_time AS "endTime"
        FROM weekly_schedules
        JOIN doctor_specialties
        ON doctor_specialties.id = weekly_schedules.doctor_specialty_id
        JOIN specialties
        ON specialties.id = doctor_specialties.specialty_id
        JOIN doctors
        ON doctors.id = doctor_specialties.doctor_id
        JOIN users
        ON users.id = doctors.user_id
        WHERE users.id = $1
        OFFSET $2
        LIMIT $3;
    `,
    [userId, per * (page - 1), per]
  );

const findByLicenseNumber = ({ licenseNumber }: z.infer<typeof doctorSchemas.findByLicenseNumber>) =>
  db.query(
    `
      SELECT * FROM doctors WHERE license_number = $1
    `,
    [licenseNumber]
  );

const registerSpecialty = ({
  specialtyId,
  monthsOfExperience,
  doctorId,
}: z.infer<typeof doctorSchemas.registerSpecialty> & { doctorId: string }) =>
  db.query(
    `
      INSERT INTO doctor_specialties (doctor_id, specialty_id, months_of_experience)
      VALUES ($1, $2, $3);
    `,
    [doctorId, specialtyId, monthsOfExperience]
  );

const createWeeklySchedule = ({
  doctorSpecialtyId,
  dayOfWeek,
  startTime,
  endTime,
}: Omit<z.infer<typeof doctorSchemas.createWeeklySchedule>, 'specialtyId'> & { doctorSpecialtyId: string }) =>
  db.query(
    `
      INSERT INTO weekly_schedules
      (doctor_specialty_id, day_of_week, start_time, end_time)
      VALUES ($1, $2, to_timestamp($3, 'HH24:MI')::timetz, to_timestamp($4, 'HH24:MI')::timetz);
    `,
    [doctorSpecialtyId, dayOfWeek, startTime, endTime]
  );

const create = async ({
  name,
  roleSlug,
  email,
  password,
  document,
  phone,
  licenseNumber,
  specialties,
}: z.infer<typeof doctorSchemas.signUp> & { roleSlug: string }) => {
  const dbClient = await db.connect();

  try {
    await dbClient.query('BEGIN;');

    const {
      rows: [{ userId }],
    } = await usersRepository.create({ name, roleSlug, email, password, document, phone }, dbClient);

    const {
      rows: [{ doctorId }],
    } = (await dbClient.query(
      `
        INSERT INTO doctors (user_id, license_number)
        VALUES ($1, $2)
        RETURNING id AS "doctorId";
      `,
      [userId, licenseNumber]
    )) as QueryResult<{ doctorId: string }>;

    const doctorSpecialtiesValues = specialties.flatMap((specialty) => [
      doctorId,
      specialty.id,
      specialty.monthsOfExperience,
    ]);
    const plaholders = specialties
      .map((_, index) => `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`)
      .join(', ');

    await dbClient.query(
      `
        INSERT INTO doctor_specialties (doctor_id, specialty_id, months_of_experience)
        VALUES ${plaholders};
      `,
      doctorSpecialtiesValues
    );

    await dbClient.query('COMMIT;');
  } catch (err) {
    await dbClient.query('ROLLBACK;');
    throw err;
  } finally {
    dbClient.release();
  }
};

export default {
  findAll,
  findAllAppointments,
  findAllWeeklySchedules,
  findByLicenseNumber,
  registerSpecialty,
  createWeeklySchedule,
  create,
};
