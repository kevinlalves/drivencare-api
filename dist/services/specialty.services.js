import errors from '../errors/index.js';
import specialtiesRepository from '../repositories/specialties.repository.js';
const findAll = async () => {
    const { rows: specialties } = await specialtiesRepository.findAll();
    return specialties;
};
const findBySlug = async ({ slug }) => {
    const { rows: [specialty], } = await specialtiesRepository.findBySlug({ slug });
    if (!specialty)
        throw errors.notFoundError('There is no specialty with the given slug');
    return specialty;
};
const create = async ({ slug, name }) => {
    const { rows: [specialty], } = await specialtiesRepository.findBySlug({ slug });
    if (specialty)
        throw errors.conflictError('Specialty already exists');
    specialtiesRepository.create({ slug, name });
};
export default { findAll, findBySlug, create };
