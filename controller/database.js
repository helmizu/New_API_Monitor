const MongoClient = require('mongodb').MongoClient
const OID = require('mongodb').ObjectId
const database = require('../libraries/database')
const config = require('../config')
const data_url = "data_url"
const connect_err = {err : "Connection Error"}
function insertDataURL(req, res) {
    MongoClient.connect(config.Mongo_URL, {useNewUrlParser : true}, function (err, client) {
        if (err) return res.status(500).json(connect_err)
        const db = client.db(config.DB_Name)
        database.insertData(db, data_url, req.body, function (err, result) {
            if (err) return res.status(500).json(err)
            res.status(201).json(result)
        })
        client.close()
    })
}

function getDataURL(req, res) {
    MongoClient.connect(config.Mongo_URL, {useNewUrlParser : true}, function (err, client) {
        if (err) return res.status(500).json(connect_err)
        const db = client.db(config.DB_Name)
        database.findData(db, data_url, {}, function (err, result) {
            if (err) return res.status(500).json(err)
            res.status(200).json(result)
        })
        client.close()
    })
}

function searchDataURL(req, res) {
    MongoClient.connect(config.Mongo_URL, {useNewUrlParser : true}, function (err, client) {
        if (err) return res.status(500).json(connect_err)
        const db = client.db(config.DB_Name)
        database.findData(db, data_url, {_id : new OID(req.params.id)}, function (err, result) {
            if (err) return res.status(500).json(err)
            res.status(200).json(result[0])
        })
        client.close()
    })
}

function updateDataURL(req, res) {
    MongoClient.connect(config.Mongo_URL, {useNewUrlParser : true}, function (err, client) {
        if (err) return res.status(500).json(connect_err)
        const db = client.db(config.DB_Name)
        database.updateData(db, data_url, req.params.id, req.body, function (err, result) {
            if (err) return res.status(500).json(err)
            res.status(200).json(result)
        })
        client.close()
    })
}

function removeDataURL(req, res) {
    MongoClient.connect(config.Mongo_URL, {useNewUrlParser : true}, function (err, client) {
        if (err) return res.status(500).json(connect_err)
        const db = client.db(config.DB_Name)
        database.removeData(db, data_url, req.params.id, function (err, result) {
            if (err) return res.status(500).json(err)
            res.status(200).json(result)
        })
        client.close()
    })
}

module.exports = { insertDataURL, getDataURL, updateDataURL, removeDataURL, searchDataURL }