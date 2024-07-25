const { check } = require("express-validator")
const validateResults = require("../utils/handleValidator")

//No necesita validatorCreateItem porque ya está haciendo uso de Multer

const validatorCreateItem = [
    check("ciudad").exists().notEmpty(), //.isLength(min:5, max:90)
    check("actividad").exists().notEmpty(),
    check("resumen").optional(),
    //Middleware tiene que responder después de la petición
    (req, res, next) => {
        return validateResults(req, res, next)
    }
    //(req, res, next) => validateResults(req, res, next) // Otra forma de invocarlo
]

const validatorMatch = [
    
]

const validatorGetItem = [
    check("id").exists().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validatorPuntuarItem = [
    check("id").exists().notEmpty(),
    check("scoring").exists().notEmpty().isLength({ min: 0, max: 10 }),
    check("resena").optional(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]
const validatorTexto = [
    check("texto").exists().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

module.exports = { validatorCreateItem, validatorGetItem, validatorPuntuarItem, validatorTexto }