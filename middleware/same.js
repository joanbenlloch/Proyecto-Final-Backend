const { handleHttpError } = require("../utils/handleError")

const sameUser = (req, res, next) => {
    try{
        if (req.params.id !== req.user.id) {
            return  handleHttpError(res, "ERROR_ID_NOT_THE_SAME", 403)
        }
        next();
    }catch(err){
        handleHttpError(res, "ERROR_NOT_SAME", 403)
    }
}
    //comprobamos que el id del usuario sea el mismo que el del token
  

module.exports = sameUser 