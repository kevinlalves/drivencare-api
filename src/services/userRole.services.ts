import { z } from 'zod';
import userRolesRepository from '../repositories/userRoles.repository.js';
import userRoleSchemas from '../schemas/userRole.schemas.js';
import errors from '../errors/index.js';

const findAll = async () => {
  const { rows: userRoles } = await userRolesRepository.findAll();

  return userRoles;
};

const findBySlug = async ({ slug }: z.infer<typeof userRoleSchemas.findBySlug>) => {
  const {
    rows: [userRole],
  } = await userRolesRepository.findBySlug({ slug });
  if (!userRole) throw errors.notFoundError('There is no user role with the given slug');

  return userRole;
};

const create = async ({ slug, name }: z.infer<typeof userRoleSchemas.create>) => {
  const {
    rows: [userRole],
  } = await userRolesRepository.findBySlug({ slug });
  if (userRole) throw errors.conflictError('User role already exists');

  userRolesRepository.create({ slug, name });
};

export default { findAll, findBySlug, create };
