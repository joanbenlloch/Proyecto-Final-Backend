const mongoose = require("mongoose")
const mongooseDelete = require("mongoose-delete")

const ComercioScheme = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true
        },
        cif: {
            type: String,
            required: true,
            unique: true
        },
        direccion: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        telefono: {
            type: String,
            required: true
        },
        mediaId: {
            type: mongoose.Types.ObjectId // Estructura (string) especial de mongo
        },
        id_pagina: {
            type: String,
            unique: true
        }

    },
    {
        timestamps: true, // TODO createdAt, updatedAt
        versionKey: false
    }
)

/**
 * Implementar método propio (custom findAllData static function) con relación a Storage
 */

ComercioScheme.statics.findAllData = function() {
    // "this." hace referencia a su propio modelo
    const joinData = this.aggregate([
        {
            // lookup =~ join (STAGE 1)
            $lookup: {
                from: "comercios",
                localField: "mediaId", // tracks.mediaId
                foreignField: "_id",   // storages._id
                as: "audio" // Alias audio
            }
        },
      /*{
            // From left join to inner join (STAGE 2) 
            $unwind:"$audio"
        } */
    ])
    return joinData
}

ComercioScheme.statics.findOneData = function(id) {
    // "this." hace referencia a su propio modelo
    const joinData = this.aggregate([
        {
            // Match by id (STAGE 1)
            $match: {
                _id: mongoose.Types.ObjectId(id)
            }
        },
        {
            // lookup =~ join (STAGE 2)
            $lookup: {
                from: "comercios",
                localField: "mediaId", // tracks.mediaId
                foreignField: "_id",   // storages._id
                as: "audio" // Alias audio
            }
        },
     /* {
            // From left join to inner join (STAGE 3) 
            $unwind:"$audio"
        }, */
    ])
    return joinData
}

ComercioScheme.plugin(mongooseDelete, {overrideMethods: "all"})
module.exports = mongoose.model("comercio", ComercioScheme) // Nombre de la colección (o de la tabla en SQL)