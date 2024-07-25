const mongoose = require("mongoose")
const mongooseDelete = require("mongoose-delete")

const PaginasScheme = new mongoose.Schema(
    {
        id_comercio: {
            type: String,
            required: true,
            unique: true
        },
        ciudad: {
            type: String
        },
        actividad: {
            type: String
        },
        titulo: {
            type: String,
            required: true
        },
        resumen: {
            type: String
        },
        url: {
            type: String
        },
        filename: {
            type: String
        },
        texto: {
            type: String
        },
        scoring: {
            type: Number,
            default: 0
        },
        numPuntuaciones: {
            type: Number,
            default: 0
        },
        resenas: {
            type: Array
        }
    },
    {
        timestamps: true, // TODO createdAt, updatedAt
        versionKey: false
    }
)
PaginasScheme.plugin(mongooseDelete, {overrideMethods: "all"})
module.exports = mongoose.model("paginas", PaginasScheme) // Nombre de la colección