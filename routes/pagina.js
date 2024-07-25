const express = require("express")
const router = express.Router();
const uploadMiddleware = require("../utils/handleStorage")//subir imagenes
const comercioMiddleware = require("../middleware/sessionComercio")
const { getItem, getItems, deleteItem, subirImagen, subirTexto, updateItem, getItemsCiudad,getItemsCiudadActividad, puntuarItem } = require("../controllers/pagina")
const { validatorCreateItem, validatorGetItem, validatorPuntuarItem, validatorTexto } = require('../validators/pagina')
const checkOrden = require("../middleware/orden")
/**
 * Lista de Items
 */
router.get("/", getItems)
/**
 * Get de una pagina
 */
router.get("/:id", validatorGetItem, getItem)
/**
 * Crar una pagina con un post
 */
//router.post("/",comercioMiddleware, validatorCreateItem, createItem)
/**
 * Subir una foto  I
 */
router.post("/imagen/:id",comercioMiddleware,validatorGetItem, uploadMiddleware.single("image"), subirImagen)

/**
 * Subir un texto
 */

router.post("/texto/:id",comercioMiddleware,validatorGetItem, validatorTexto,  subirTexto)

/**
 * ACTUALIZAR DATOS DE LA PAGINA
 */
router.put("/:id",comercioMiddleware,validatorGetItem, validatorCreateItem, updateItem)
/**
 * Eliminar Item
 */
router.delete("/:id",comercioMiddleware, validatorGetItem, deleteItem)

/**
 * Get de las paginas de una ciudad
 */
router.get("/ciudad/:ciudad/:orden",checkOrden(["asc","noOrden"]), getItemsCiudad)
/**
 * Get de las paginas de una ciudad y actividad
 */
router.get("/ciudad_actividad/:ciudad/:actividad/:orden",checkOrden(["asc","noOrden"]), getItemsCiudadActividad)

/**
 * patch para meter la puntuacion y reseña opcional
 */
router.patch("/:id", validatorPuntuarItem,  puntuarItem)



module.exports = router;