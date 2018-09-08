#Creating a Facebook Messenger Channel for Ubiquity

To create a Facebook channel you most create a POST request with the below information to `/ubiquity`

```
{
	"agent": AGENT_ID,
	"service": "facebook",
	"details": {
		"pageToken": "YOUR_PAGE_TOKEN",
		"appSecret": "YOUR_APP_SECRET"
	}
}
```

Where `AGENT_ID` is the id of the agent you would like to connect with this channel. The app secret can be found under basic settings of your page and is used to verify incoming requests from Facebook. The page token can be found under the messaging section of your page's developer setting. And is used both for initial verification as well as posting messages back to Facebook.

## Response Formatting

There are two ways to format your response for Facebook Messenger. You can use the standard Ubiquity syntax, which tried to translate responses between all platforms. Or you can specify a custom Facebook messenger response.

### Using Facebook Messenger Syntax

To use a custom facebook messenger syntax, all you need to do is make sure your reply from articulate includes a properly formatted `facebook` object. To generate this using handlebars, you can access the `ubiquity` in the CSO. For example:

```
{
  "textResponse" : "{{textResponse}}",
  "facebook": {
    "recipient": {{{JSONstringify ubiquity.facebook.sender}}},
    "message": {
      "text": "{{textResponse}}",
      "quick_replies": [
        {
          "content_type": "text",
          "title": "blue pill",
          "payload": "Custom payload"
        },
        {
          "content_type": "location"
        }
      ]
    }
  }
}
```

### Ubiquity Response Syntax

This channel expects a `textResponse` in the reply from Articulate.

Optionally you may specify up to 11 quick reply buttons. For more documentation on Quick reply buttons see Facebook docs here: https://developers.facebook.com/docs/messenger-platform/send-messages/quick-replies#text

To add them to your response use the webhook response formatting and make it look something like this:

```
{
  "textResponse" : "{{ textResponse }}",
  "buttons": [
    {
      "content_type": "text",
      "title": "Hello",
      "payload": "greetings"
    }  
  ]
}
```

