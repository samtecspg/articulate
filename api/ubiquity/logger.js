"use strict";
const Wreck = require("wreck");

const logger = {};

const slackURL = process.env.SLACK_LOG_URL;

logger.log = (request, response, timing) => {


    const responseTime = timing / 1000;
    if (slackURL) {
        const slackMessage = {
            "text": `There was a new Ubiquity request, the Articulate response time was ${responseTime} seconds.`,
            "attachments": [
                {
                    "fallback": request,
                    "author_name": "User",
                    "text": request,
                    "color": "#36a64f"
                },
                {
                    "fallback": response,
                    "author_name": "Bot",
                    "text": response,
                    "color": "#ef7e31"
                }
            ]
        };
        Wreck.post(slackURL, { payload: slackMessage }, (err,res) => {

          if (err) {
            console.log('Ubiquity Logging Error', err);
          }
        });
    }
};

module.exports = logger;
