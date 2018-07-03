---
title: Ubiquity Basics
layout: default
order: 0
---

# Ubiquity Basics

We're moving towards one click connections for common front end platforms. These connections will also implement translations for common functionality like text, images, buttons, maps, etc. For the moment only text responses are supported and the below three channels are the only ones implemented. Look for more channels and functionality in the near future.

## Available Channels

- Slack

## Slack

1. Create a Slack app https://api.slack.com/apps
2. Add a Bot User
3. POST a request similar to the below to the ubiquity API. The `botToken` comes from the OAuth & Permissions page under features.

```
curl --request POST \
  --url http://localhost:7500/ubiquity \
  --header 'content-type: application/json' \
  --data '{
	"agent": 1,
	"service": "slack",
	"details": {
    "botToken": "xoxb-135120406320-387310332693-jaHymbKH6jfLPpXrC4MiqbAF"
	}
}'
```

You should receive a response back similar to this:

```
{
	"id": "ByKl0EaWQ",
	"agent": 1,
	"service": "slack",
	"botToken": "xoxb-135120406320-387310332693-jaHymbKH6jfLPpXrC4MiqbAF",
	"status": "Created",
	"dateCreated": "2018-06-24T15:51:13.396Z",
	"dateModified": "2018-06-24T15:51:13.396Z"
}
```

4. Save Changes and test your bot by mentioning them in a channel.