const EventEmitter = require('eventemitter3')
const hippie = require('hippie')

class TestAPI extends EventEmitter {
    constructor(method = '', url = '', options = { type : '', data : {}, expectStatus : 0, expectKey : ''}) {
        super()
        if (!options || (options && (!options.expectStatus)) || options.expectStatus === 0) {
            options.expectStatus = 200
        }
        if (!options || (options && (!options.data)) || Object.keys(options.data).length < 1) {
            options.data = null
        }
        if (!options || (options && (!options.type)) || options.type === '') {
            options.header = null
        }
        if (!options || (options && (!options.expectKey)) || options.expectKey === '') {
            options.expectKey = null
        } else {
            this.convertKey(options.expectKey, function (key) {
                options.expectKey = key
            })
        }
        
        this.method = method
        this.url = url
        this.options = options
    }
    
    monitor(cb) {
        if(this.options.type === 'API') {
            if(this.options.expectKey) {
                hippie()
                .json()
                .url(this.url)
                .method(this.method)
                .expectStatus(this.options.expectStatus)
                .expectKey(this.options.expectKey)
                .end(function(err, res, body) {
                    if (err) return cb(err, null, null);
                    cb(null, res, JSON.stringify(body))
                });
            } else {
                hippie()
                .json()
                .url(this.url)
                .method(this.method)
                .expectStatus(this.options.expectStatus)
                .end(function(err, res, body) {
                    if (err) return cb(err, null, null);
                    cb(null, res, JSON.stringify(body))
                });
            }
        } else {
            hippie()
            .url(this.url)
            .method(this.method)
            .expectStatus(this.options.expectStatus)
            .end(function(err, res, body) {
                if (err) return cb(err, null, null);
                cb(null, res, body)
            });
        }
    }

    convertKey(key, cb) {
        const keyArr = key.split(',')
        const newKey = []
        keyArr.map(k => {
            newKey.push(`[0].${k}`)
            if(newKey.length === keyArr.length) {
                return cb(newKey.toString())
            }
        })
    }
}

module.exports = TestAPI