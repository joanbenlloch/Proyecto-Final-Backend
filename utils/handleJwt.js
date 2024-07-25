const jwt = require("jsonwebtoken")
const getProperties = require("../utils/handlePropertiesEngine")

const propertiesKey = getProperties()
/**
 * El objeto del usuario
 * @param {*} user 
 */
const tokenSign = async (user) => {
    const sign = jwt.sign(
        {
            //_id: user._id,
            [propertiesKey.id]: user[propertiesKey.id], // [] propiedad dinámica
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "24h"
        }
    )
    return sign
}

const tokenSignComercio = async (comercio) => {
    const sign = jwt.sign(
        {
            ["_id"]: comercio["_id"], // [] propiedad dinámica
            role: "comercio"
        },
        process.env.JWT_SECRET
    )
    return sign
}

/**
 * Token se sesión
 * @param {*} tokenJwt 
 */
const verifyToken = async (tokenJwt) => {
    try {
        return jwt.verify(tokenJwt, process.env.JWT_SECRET)
    }catch(err) {
        console.log(err)
    }
}

module.exports = { tokenSign, tokenSignComercio, verifyToken }