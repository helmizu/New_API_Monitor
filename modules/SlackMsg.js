const EventEmitter = require('eventemitter3')
const request = require('request');

class SlackMsg extends EventEmitter {
    constructor(SLACK_WEBHOOK_URL = "") {
        super();
        if (!SLACK_WEBHOOK_URL || SLACK_WEBHOOK_URL === "") {
            throw new Error("You need to specify an SLACK_WEBHOOK_URL");
        }
        this.SLACK_WEBHOOK_URL = SLACK_WEBHOOK_URL;
    }
    
    send(message, cb){
        let slackPayload = {
            text: `* ${message} *`
        }
        
        request({
            method: 'POST',
            uri: this.SLACK_WEBHOOK_URL,
            body: slackPayload,
            json: true
        }, (err, res, body) => {
            if (err) return console.log(`Error posting to Slack: ${err}`)
            cb()
        })
    }    
}

module.exports = SlackMsg;