const Slack = require('../modules/SlackMsg')
const TestAPI = require('../modules/TestAPI')
var statusCode = []

function monitor(SLACK_WEBHOOK_URL = '', URL = []) {
    const slack = new Slack(SLACK_WEBHOOK_URL)
    URL.map(api => {
        if(!statusCode[api.url]) {
            statusCode[api.url] = { status : [] }
        }
        const data = {}
        if (api.data) {
            data = JSON.parse(api.data)
        }
        new TestAPI(api.method, api.url, { type : api.type, data : data, expectStatus : parseInt(api.expectStatus), expectKey : api.expectKey})
        .monitor(function(err, res, body){
            if (err) {
                if (statusCode[api.url].status[statusCode[api.url].status.length-1] !== err.actual) {
                    slack.send(`Url : ${err.request.url} \n Request : ${err.request.method} \n Data : ${err.request.options.data} \n\n Respond : ${err.actual} \n\n Error : ${err.stack} \n\n Body : ${body}`, function(){})
                }
                statusCode[api.url].status.push(err.actual)
            } else {
                if(statusCode[api.url].status[statusCode[api.url].status.length-1] !== res.statusCode) {
                    slack.send(`Url : ${res.request.uri.href} \n Request : ${res.request.method} \n Data : ${res.request.data ? res.request.data : null} \n\n Respond : ${res.statusCode} \n\n Body : ${body}`, function(){})
                }
                statusCode[api.url].status.push(res.statusCode)
            }
            if(statusCode[api.url].status.length > 3) {
                statusCode[api.url].status.shift()
            }
        })
    })
}

function cekNow(SLACK_WEBHOOK_URL = '', URL = {}, cb) {
    const slack = new Slack(SLACK_WEBHOOK_URL)
    var data = ''
    if (URL.data) {
        data = JSON.parse(URL.data)
    }
    const API = new TestAPI(URL.method, URL.url, {type : URL.type, data : data, expectStatus : parseInt(URL.expectStatus), expectKey : URL.expectKey})
    API.monitor(function (err, result, body) {
        if (err) {
            slack.send(`Url : ${err.request.url} \n Request : ${err.request.method} \n Data : ${err.request.options.data} \n\n Respond : ${err.actual} \n\n Error : ${err.stack} \n\n Body : ${body}`, function(){})
            cb(err, null)
        } else {
            slack.send(`Url : ${result.request.uri.href} \n Request : ${result.request.method} \n Data : ${result.request.data ? result.request.data : null} \n\n Respond : ${result.statusCode} \n\n Body : ${body}`, function(){})
            cb(null, result)
        }
    })
}

module.exports = { monitor, cekNow }