import userRoleServices from '../services/userRole.services.js';
const findAll = async (req, res, next) => {
    try {
        const userRoles = await userRoleServices.findAll();
        res.send(userRoles);
    }
    catch (err) {
        next(err);
    }
};
const findBySlug = async (req, res, next) => {
    const { slug } = res.locals;
    try {
        const userRole = await userRoleServices.findBySlug({ slug });
        res.send(userRole);
    }
    catch (err) {
        next(err);
    }
};
const create = async (req, res, next) => {
    const { slug, name } = res.locals;
    try {
        await userRoleServices.create({ slug, name });
        res.sendStatus(201);
    }
    catch (err) {
        next(err);
    }
};
export default { findAll, findBySlug, create };
