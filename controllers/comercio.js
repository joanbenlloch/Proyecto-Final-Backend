const { comercioModel } = require('../models')
const { paginaModel } = require('../models')
const { handleHttpError } = require('../utils/handleError')
const { tokenSignComercio } = require('../utils/handleJwt')
const { matchedData } = require('express-validator')
/**
 * Obtener lista de la base de datos
 * @param {*} req 
 * @param {*} res 
 */
const getItems = async (req, res) => {
    try{
        const user = req.user //Obtengo trazabilidad del usuario, puedo ver qué solicita, su rol, etc.
        var data
        //(process.env.ENGINE_DB === "nosql") ? data = await tracksModel.find() : data = await tracksModel.findAll()
        data = await comercioModel.findAllData() // findAllData(): custom static function
        res.send({data, user})
    }catch(err){
        console.log(err) //Opcional
        //handleHttpError(res, 'ERROR_GET_ITEMS', 404)
        handleHttpError(res, 'ERROR_GET_ITEMS') //Si nos sirve el de por defecto que hemos establecido, no es necesario pasar el 403
    }
}

/**
 * Obtener un detalle
 * @param {} req 
 * @param {*} res 
 */
const getItem = async (req, res) => {
    try{
        const {id} = matchedData(req) //Me quedo solo con el id
        
        const data = await comercioModel.findOneData(id)
        res.send(data)
    } catch(err){
        console.log(err)
        handleHttpError(res, "ERROR_GET_ITEM")
    }
}

/**
 * Inserta un registro
 * @param {*} req 
 * @param {*} res 
 */
const createItem = async (req, res) => {
    try {
        //const { body } = req
        //const data = await tracksModel.create(body)
        //res.send(data)

        //express-validator nos provee de la función matchedData
        //const body = req.body //El dato según llega (si hay algún dato de más, nos daría error en el modelo)
        //const bodyClean = matchedData(req) //El dato filtrado por las especificaciones
        //res.send({ body, bodyClean })

        const body = req.body //Dato filtrado por la definición en el validador
        const comercio = await comercioModel.create(body);
        console.log("id del comercio:",comercio.id)
        const pagina = await paginaModel.create({id_comercio: comercio.id, titulo: body.nombre});
        console.log("id de la pagina", pagina.id)
        const comercio_updated = await comercioModel.findByIdAndUpdate(comercio.id, {id_pagina: pagina.id}, {new: true});
        const data = {
            token: await tokenSignComercio(comercio_updated),
            pagina: pagina, 
            comercio_updated
        }

        res.send(data)    
    }catch(err){
        console.log(err)
        handleHttpError(res, 'ERROR_CREATE_ITEMS')
    }
}

/**
 * Actualizar un resitro
 * @param {*} req 
 * @param {*} res 
 */
const updateItem = async (req, res) => {
    try {
        const {id, ...body} = matchedData(req) //Extrae el id y el resto lo asigna a la constante body
        const data = await comercioModel.findByIdAndUpdate(id, body, {new: true});
        res.send(data)    
    }catch(err){
        console.log(err) 
        handleHttpError(res, 'ERROR_UPDATE_ITEMS')
    }
}

/**
 * Eliminar un registro
 * @param {*} req 
 * @param {*} res 
 */
const deleteItem = async (req, res) => {
    try {
        const {id} = matchedData(req)
        //const data = await comercioModel.deleteOne({_id:id}); // "deleteOne" realiza el borrado físico en la BD
        const data = await comercioModel.delete({_id:id}); // "delete" realiza el borrado lógico
        res.send(data)    
    }catch(err){
        //console.log(err)
        handleHttpError(res, 'ERROR_DELETE_ITEM')
    }
}


module.exports = { getItems, getItem, createItem, updateItem, deleteItem };