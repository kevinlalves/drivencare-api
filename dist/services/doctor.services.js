import usersRepository from '../repositories/users.repository.js';
import errors from '../errors/index.js';
import doctorsRepository from '../repositories/doctors.repository.js';
import userRolesRepository from '../repositories/userRoles.repository.js';
import specialtiesRepository from '../repositories/specialties.repository.js';
const signUp = async ({ name, email, password, document, phone, licenseNumber, specialties, }) => {
    const { rows: [user], } = await usersRepository.findByEmail(email);
    if (user)
        throw errors.conflictError('Email is already in use');
    const { rows: [doctorRole], } = await userRolesRepository.findBySlug({ slug: 'doctor' });
    const { rows: dbSpecialties } = await specialtiesRepository.findBySlugs(specialties.map((specialty) => specialty.slug));
    if (dbSpecialties.length !== specialties.length) {
        throw errors.unprocessableEntityError('One or more specialties are not valid.');
    }
    for (let i = 0; i < specialties.length; i++)
        specialties[i].id = dbSpecialties[i].id;
    return doctorsRepository.create({
        name,
        roleId: doctorRole.id,
        email,
        password,
        document,
        phone,
        licenseNumber,
        specialties,
    });
};
export default { signUp };
