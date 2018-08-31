const Slack = require('../modules/SlackMsg')
const TestAPI = require('../modules/TestAPI')

function monitor(SLACK_WEBHOOK_URL = '', URL = []) {
    const slack = new Slack(SLACK_WEBHOOK_URL)
    var statusCode = []
    URL.map(api => {
        statusCode[api.url] = { status : [] }
        setInterval(
            function () {
                new TestAPI(api.method, api.url, { type : api.type, data : api.data, expectStatus : api.expectStatus, expectKey : api.expectKey})
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
            }
            , 1*1000*30
        )
    })
}

module.exports = monitor