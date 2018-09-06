const OID = require('mongodb').ObjectId
const database = {}

database.insertData = function (db, col, data, cb) {
    const collection = db.collection(col);
    collection.insertOne(data, function (err, result) {
        if (err) return cb({
            err: "Insert data gagal"
        }, null)
        cb(null, result)
    })
}

database.findData = function (db, col, filter, cb) {
    const collection = db.collection(col);
    collection.find(filter).toArray(function (err, docs) {
        if (err) return cb({
            err: "Get data gagal"
        }, null)
        cb(null, docs)
    });
}

database.updateData = function (db, col, id, data, cb) {
    const collection = db.collection(col);
    collection.updateOne({
        _id: new OID(id)
    }, {
        $set: data
    }, function (err, result) {
        if (err) return cb({
            err: "Update data gagal"
        }, null)
        cb(null, result)
    });
}

database.removeData = function (db, col, id, cb) {
    const collection = db.collection(col);
    collection.deleteOne({
        _id: new OID(id)
    }, function (err, result) {
        if (err) return cb({
            err: "Remove data gagal"
        }, null)
        cb(null, result)
    });
}

module.exports = database