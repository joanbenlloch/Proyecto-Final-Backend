const { handleHttpError } = require("../utils/handleError")


const checkOrden = (ordenes) => (req, res, next) => {
    try{
        const orden = req.params.orden
        const checkValueOrden = ordenes.includes(orden)
        if (!checkValueOrden) {
            handleHttpError(res, "NOT_ALLOWED", 403)
            return
        }
        next()
    }catch(err){
        handleHttpError(res, "ERROR_PERMISSIONS", 403)
    }

}

module.exports = checkOrden