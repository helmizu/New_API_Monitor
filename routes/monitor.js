const Router = require('express').Router()
const monitor = require('../controller/monitor')
const config = require('../config/index')

const URL = [
    {
        method : "GET",
        url : "http://localhost:3000/monitor",
        type : "API",
        expectKey : "msg"
    }
]

Router.get('/', function(req, res) {
    res.status(200).json({msg : "hello. this default route"})
})

Router.get('/test', function (req, res) {
    monitor(config.SLACK_WEBHOOK_URL, URL)
})
module.exports = Router