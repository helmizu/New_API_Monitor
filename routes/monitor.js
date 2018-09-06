const Router = require('express').Router()
const {
    cekNow
} = require('../controller/monitor')
const config = require('../config/index')
const MongoClient = require('mongodb').MongoClient
const OID = require('mongodb').ObjectId

Router.get('/', function (req, res) {
    res.status(200).json({
        msg: "hello. this default route"
    })
})

Router.get('/now/:id', function (req, res) {
    MongoClient.connect(config.Mongo_URL, function (err, client) {
        const db = client.db(config.DB_Name)
        db.collection(config.data_url).find({
            _id: new OID(req.params.id)
        }).toArray(function (err, URL) {
            client.close()
            if (err) return res.status(500).json(err)
            cekNow(config.SLACK_WEBHOOK_URL, URL[0], function (err, result) {
                if (err) return res.status(400).json(err)
                return res.status(200).json(result)
            })
        })
    })
})
module.exports = Router