const { paginaModel } = require('../models')
const { storageModel } = require('../models')
const { comercioModel } = require('../models')
const { handleHttpError } = require('../utils/handleError')
const { matchedData } = require('express-validator')
const fs = require("fs")

const PUBLIC_URL = process.env.PUBLIC_URL
const MEDIA_PATH = __dirname + "/../storage"
/**
 * Obtener lista de la base de datos
 * @param {*} req 
 * @param {*} res 
 */
const getItems = async (req, res) => {
    try {
        const data = await paginaModel.find({})
        res.send(data)
    }catch(err) {
        handleHttpError(res, 'ERROR_LIST_ITEMS')
    }
}

/**
 * get pagina de ciudad
 */
const getItemsCiudad = async (req, res) => {
    try{
        const ciudad = req.params.ciudad
        const orden = req.params.orden
        var data
        if(orden=="asc"){
            data = await paginaModel.find({ ciudad: ciudad }).sort({scoring: orden})    
        }else{
            data = await paginaModel.find({ ciudad: ciudad })
        }
        
        res.send(data)
    }catch(err){
        handleHttpError(res, "ERROR_GET_ITEM")
    }
}

/**
 * get pagina de ciudad y actividad
 */
const getItemsCiudadActividad = async (req, res) => {
    try{
        const ciudad = req.params.ciudad
        const actividad = req.params.actividad
        const orden = req.params.orden
        var data
        if(orden=="asc"){
            data = await paginaModel.find({ ciudad: ciudad, actividad: actividad }).sort({scoring: orden})
        }else{
            data = await paginaModel.find({ ciudad: ciudad, actividad: actividad })
        }
        res.send(data)
    }   catch(err){
        handleHttpError(res, "ERROR_GET_ITEM")
    }
}


/**
 * Obtener un detalle
 * @param {} req 
 * @param {*} res 
 */
const getItem = async (req, res) => {
    try{
        const {id} = matchedData(req)
        const data = await paginaModel.findById(id)
        res.send(data)
    } catch(err){
        //console.log(err)
        handleHttpError(res, "ERROR_GET_ITEM")
    }
}

/**
 * Inserta un registro
 * @param {*} req 
 * @param {*} res 
 */
/*
const createItem = async (req, res) => {
    try{
        const body = matchedData(req) 
        const data = await paginaModel.create(body);
        res.send(data)
    }catch(err){
        //console.log(err)
        handleHttpError(res, "ERROR_CREATE_ITEM")
    }
}*/

const subirImagen = async (req, res) => {
    try {
        const { id } = matchedData(req)
        const { file } = req
        const comercio = await comercioModel.find({id_pagina: id}) 
        console.log(req.user.id)
        if( comercio._id == req.user.id){
            const fileData = { 
                filename: file.filename,
                url: process.env.PUBLIC_URL+"/"+file.filename
        }
            console.log(fileData)
            const storage = await storageModel.create(fileData)
    
            const data = await paginaModel.findByIdAndUpdate(id, {url: fileData.url, filename: fileData.filename}, {new: true})
            
            res.send(data, storage)
        }else {
            handleHttpError(res, "ERROR_NOT_SAME")
        }
        
    }catch(err) {
        handleHttpError(res, "ERROR_DETAIL_ITEM")
    }
}

const subirTexto = async (req, res) => {
    try {
        const {id, ...texto} = matchedData(req) //Extrae el id y el resto lo asigna a la constante body
        const data = await paginaModel.findByIdAndUpdate(id, {texto: texto.texto}, {new: true});
        res.send(data)
    }catch(err) {
        handleHttpError(res, "ERROR_UPDATE_ITEMS")
    }
}

const updateItem = async (req, res) => {
    try {
        const {id, ...body} = matchedData(req) //Extrae el id y el resto lo asigna a la constante body
        const data = await paginaModel.findByIdAndUpdate(id, body, {new: true});
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
    try{
        const {id} = matchedData(req)
        const data = await paginaModel.deleteOne({_id:id})
        res.send(data)
    } catch(err){
        //console.log(err)
        handleHttpError(res, "ERROR_GET_ITEM")
    }
}

/**
 * puntuar un comercio
 * findByIdAndUpdate
 */

const puntuarItem = async (req, res) => {
    try{
        const {id, ...scoring} = matchedData(req)
        const resena = scoring.resena
        console.log("Reseña:",resena)
        var resenias = await paginaModel.findById(id, 'resenas')
        console.log("Reseñas:",resenias.resenas)
        console.log("Scoring:",scoring.scoring)
        var scoreInicial = await paginaModel.findById(id, 'scoring')
        
        console.log("Score inicial:",scoreInicial.scoring)
        const pagina = await paginaModel.findById(id)
        var numVotosInicial = pagina.numPuntuaciones

        console.log("numVotos inicial:",numVotosInicial)
        const numVotos = numVotosInicial + 1
        console.log("numVotos:",numVotos)
        const score = (scoreInicial.scoring*numVotosInicial + scoring.scoring)/numVotos
        console.log("Score:",score)
        var data

        if(!resena){
            data = await paginaModel.findByIdAndUpdate(id, {scoring: score, numPuntuaciones: numVotos}, {new: true});
        }else{
            resenias.resenas.push(resena)
            console.log("Reseñas:",resenias)
            data = await paginaModel.findByIdAndUpdate(id, {scoring: score, numPuntuaciones: numVotos, resenas: resenias.resenas}, {new: true});
            
        }

        // data = await paginaModel.findByIdAndUpdate(id, {scoring: score}, {new: true});
        res.send(data)
    } catch(err){
        handleHttpError(res, "ERROR_SCORE_ITEM")
    }
}


//

module.exports = { getItems, getItem, deleteItem, subirImagen, subirTexto, updateItem, getItemsCiudad, getItemsCiudadActividad, puntuarItem };