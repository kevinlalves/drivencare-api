import doctorServices from '../services/doctor.services.js';
const singUp = async (req, res, next) => {
    const { name, email, password, document, phone, licenseNumber, specialties } = res.locals;
    try {
        await doctorServices.signUp({ name, email, password, document, phone, licenseNumber, specialties });
        res.sendStatus(201);
    }
    catch (err) {
        next(err);
    }
};
export default { singUp };
