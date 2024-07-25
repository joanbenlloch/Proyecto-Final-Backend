const pathModels = './nosql/'

const models = {
    usersModel: require(pathModels+'users'),
    comercioModel: require(pathModels+'comercio'),
    paginaModel: require(pathModels+'pagina'),
    storageModel: require(pathModels+'storage')
}

module.exports = models