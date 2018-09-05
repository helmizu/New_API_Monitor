const Router = require('express').Router()
const Data = require('../controller/database')

Router.get('/', Data.getDataURL)
Router.get('/:id', Data.searchIdDataURL)
Router.post('/', Data.insertDataURL)
Router.put('/:id', Data.updateDataURL)
Router.delete('/:id', Data.removeDataURL)

module.exports = Router