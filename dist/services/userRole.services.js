import userRolesRepository from '../repositories/userRoles.repository.js';
import errors from '../errors/index.js';
const findAll = async () => {
    const { rows: userRoles } = await userRolesRepository.findAll();
    return userRoles;
};
const findBySlug = async ({ slug }) => {
    const { rows: [userRole], } = await userRolesRepository.findBySlug({ slug });
    if (!userRole)
        throw errors.notFoundError('There is no user role with the given slug');
    return userRole;
};
const create = async ({ slug, name }) => {
    const { rows: [userRole], } = await userRolesRepository.findBySlug({ slug });
    if (userRole)
        throw errors.conflictError('User role already exists');
    userRolesRepository.create({ slug, name });
};
export default { findAll, findBySlug, create };
