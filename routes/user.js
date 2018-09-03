const Router = require('express').Router()

Router.post('/', function (req, res) {
    res.send(req.body)
})

module.exports = Router