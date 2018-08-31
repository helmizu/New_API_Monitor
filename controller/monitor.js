const Slack = require('../modules/SlackMsg')
const TestAPI = require('../modules/TestAPI')

function monitor(SLACK_WEBHOOK_URL = '', URL = []) {
    const slack = new Slack(SLACK_WEBHOOK_URL)
    var statusCode = []
    URL.map(api => {
        statusCode[api.url] = { status : [] }
        setInterval(
            function () {
                new TestAPI(api.method, api.url, { header : api.header, data : api.data, expectStatus : api.expectStatus, expectKey : api.expectKey})
                .monitor(function(err, res, body){
                    if (err) {
                        if (statusCode[api.url].status[statusCode[api.url].status.length-1] !== err.actual) {
                            slack.send(`url : ${err.request.url} \n request : ${err.request.method} \n data : ${err.request.data} \n\n respond : ${err.actual} \n\n error : ${err.stack} \n\n body : ${body}`)
                        }
                        statusCode[api.url].status.push(err.actual)
                    } else {
                        if(statusCode[api.url].status[statusCode[api.url].status.length-1] !== res.statusCode) {
                            slack.send(`url : ${res.request.uri.href} \n request : ${res.request.uri.method} \n data : ${res.request.uri.data ? res.request.uri.data : null} \n\n respond : ${res.statusCode} \n\n body : ${body}`)
                        }
                        statusCode[api.url].status.push(res.statusCode)
                    }
                    if(statusCode[api.url].status.length > 3) {
                        statusCode[api.url].status.shift()
                    }
                })
            }
            , 1*1000*30
        )
    })
}

module.exports = monitor