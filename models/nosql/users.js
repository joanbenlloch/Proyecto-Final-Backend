const mongoose = require("mongoose")
const mongooseDelete = require("mongoose-delete")

const UserScheme = new mongoose.Schema(
    {
        name: {
            type: String
        },
        age: {
            type: Number
        },
        email: {
            type: String,
            unique: true
        },
        password:{
            type: String,  // TODO Guardaremos el hash
            select: false
        },
        ciudad: {
            type: String,
            required: true
        },
        intereses: {
            type: String,
            required: true
        },
        permiteRecibirOfertas: {
            type: Boolean,
            required: true
        },
        role:{
            type: String,
            enum: ["user", "admin"], 
            default: "user"
        }
    },
    {
        timestamps: true, // TODO createdAt, updatedAt
        versionKey: false
    }
)
UserScheme.plugin(mongooseDelete, {overrideMethods: "all"})
module.exports = mongoose.model("users", UserScheme) // Nombre de la colección (o de la tabla en SQL)