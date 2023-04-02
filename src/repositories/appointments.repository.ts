import db from '../config/database/connection.js';

const findByUniqueInfo = ({ weeklyScheduleId, date }: { [key: string]: string }) =>
  db.query(
    `
      SELECT * FROM appointments
      WHERE weekly_schedule_id = $1
      AND date = $2;
    `,
    [weeklyScheduleId, date]
  );

export default { findByUniqueInfo };
