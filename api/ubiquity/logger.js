"use strict";
const Wreck = require("wreck");
const Elasticsearch = require("elasticsearch");

const logger = {};

// Logging Connection Variables
// Slack
const slackURL = process.env.SLACK_LOG_URL;

// Elasticsearch
const elasticURL = process.env.ELASTIC_URL;
const elasticUsername = process.env.ELASTIC_USER;
const elasticPassword = process.env.ELASTIC_PASSWORD;
let elasticClient;

if (elasticURL) {
    const esOptions = {
        host: elasticURL
    };

    if (elasticUsername && elasticPassword) {
        esOptions.auth = `${elasticUsername}:${elasticPassword}`;
    }
    elasticClient = new Elasticsearch.Client(esOptions);
}

logger.log = (request, response, timing) => {

    const responseTime = timing / 1000;
    let source = "UI";
    let channel = "UI";
    if (request.ubiquity.twilio) {
        source = "Twilio";
        channel = request.ubiquity.twilio.From;
    }

    if (slackURL) {
        const slackMessage = {
            "text": `There was a new ${source} request from ${channel}, the Articulate response time was ${responseTime} seconds.`,
            "attachments": [
                {
                    "fallback": request.text,
                    "author_name": "User",
                    "text": request.text,
                    "color": "#36a64f"
                }
            ]
        };

        if (response.textResponse) {
            slackMessage.attachments.push(
                {
                    "fallback": response.textResponse,
                    "author_name": "Bot",
                    "text": response.textResponse,
                    "color": "#ef7e31"
                }
            );
        }
        else {
            slackMessage.attachments.push(
                {
                    "fallback": response.message || "Articulate produced an error",
                    "author_name": "Bot",
                    "title": response.message || "There was an error",
                    "color": "red"
                }
            );
        }

        Wreck.post(slackURL, { payload: slackMessage }, (err,res) => {

            if (err) {
                console.log("Ubiquity Logging Error for Slack", err);
            }
        });
    }

    if (elasticURL) {
        const esPayload = {
            index: "ubiquity-logs",
            type: "default",
            body: {
                request,
                response
            }
        };

        elasticClient.index(esPayload, (err, res) => {

            if (err) {
                console.log("Ubiquity Logging Error for Elasticsearch.", err);
            }
        });
    }

};

module.exports = logger;
