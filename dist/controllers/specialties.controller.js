import specialtyServices from '../services/specialty.services.js';
const findAll = async (req, res, next) => {
    try {
        const specialties = await specialtyServices.findAll();
        res.send(specialties);
    }
    catch (err) {
        next(err);
    }
};
const findBySlug = async (req, res, next) => {
    const { slug } = res.locals;
    try {
        const specialty = await specialtyServices.findBySlug({ slug });
        res.send(specialty);
    }
    catch (err) {
        next(err);
    }
};
const create = async (req, res, next) => {
    const { slug, name } = res.locals;
    try {
        await specialtyServices.create({ slug, name });
        res.sendStatus(201);
    }
    catch (err) {
        next(err);
    }
};
export default { findAll, findBySlug, create };
