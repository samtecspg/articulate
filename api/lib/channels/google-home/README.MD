# GOOGLE HOME CHANNEL

This connector will allow sending messages between Google Home and Articulate's agents

## Prerequisites

1. Download and install the [gactions CLI](https://developers.google.com/actions/tools/gactions-cli) tool.
2. Have a google acount to access [Google Actions console](https://console.actions.google.com)

## Agent Considerations (IMPORTANT)

### MAIN Google Action

You are going to create a channel that works a little bit different than Facebook Messenger, Twilio or Slack. Whenever a user is going to talk with your agent using google home he is going to start with a query pattern to trigger the main action. This main action probably should be answered with something like a greeting or welcome action.

So if your user start your Google Action by saying "Talk to My Awesome Agent" you want to answer "Hey there, how can I help your" or something like that. Maybe users could be more concise and say "Hey Google, Ask to My Awesome Agent how is the weather in New York", and you would like to directly respond his request.

We recommend you to handle this cases by training this phrases in your agent sayings under the dialogue tab and tagging them with the proper action, so whenever a user says "Talk To My Awesome Agent" your agent will know how to handle that main intent. If you don't do this, probably your agent will fallback.

On the step 5 you are going to see how Query Patterns are specified. So be sure to add the query patterns you specified in this step into your sayings tab to train your agent with this phrases.

### FINAL Action

Articulate's actions can have an additional payload besides the user text, session id, and timezone. This payload will be useful in order to specify data that you could use to handle business logic or any other relevant stuff.

In this case, for Google Channel we are going to use this additional payload to specify an attribute called `closeGoogleActions` and set its value to `true` in the action where you want to close the conversation with the user.

You are going to find this additional payload in "Response" tab of your action, under the title "Response Format". You need to enable the toggle that is below the action's responses and specify the additional payload, as show in the next image:

![Google Actions Console main screen](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/google-home/screenshots/12%20-%20Close%20Google%20Action.png)

Now, whenever this action is recognized by your agent, the propery response will be generated and your agent will send a `close` instruction to Google Home in order to close the mic and Google Home will stop listenning the user.

## Configuration

1. Enter to your Google Actions console and create a new project:

![Google Actions Console main screen](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/google-home/screenshots/01%20-%20Google%20Actions%20Console.png)

![New project form](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/google-home/screenshots/02%20-%20New%20Project.png)

2. Now that you have a project is time to choose a development experience. Please select the Actions SDK option at the very end, and copy the Update app command that's going to be shown. Once you copy the command, click OK:

![Development Experience](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/google-home/screenshots/03%20-%20New%20Project%20Screen.png)

![Actions SDK info](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/google-home/screenshots/04%20-%20Copy%20command.png)

4. You now need to setup your Google Action. In the overview screen click on "Decide how your Action is invoked". In the next screen specify your Display Name and hit SAVE:

![Google Action Overview](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/google-home/screenshots/05%20-%20Decide%20display%20name.png)

![Set display name](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/google-home/screenshots/06%20-%20Set%20display%20name.png)

5. Create a new connection in the Articulate UI between Google Home and your desired Agent. Please fill the Query Patterns for Main Action in the details Tab. This patterns are the phrases that users will use to start a conversation with your Agent over Google Home. The Query Patterns should include your Google Action Display Name: 

![New Google Home Connection](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/google-home/screenshots/07%20-%20New%20Google%20Home%20Connection.png)

![Google Home Details](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/google-home/screenshots/08%20-%20Query%20Patterns.png)

6. If you are ready with your query patterns hit Save. This is going to enable you a download button in the main tab of your new connection. The file that you downloaded when you click the button is the actions package that you are going to upload to your project. BUT!, before uploading your actions package you need to modify the url of your conversation details with the address of your public server where the Articulate API is running. This file already haves the your connection route in the URL, but you need to replace "<YOUR API SERVER ADDRESS>" with the proper value. **YOUR ADDRESS MUST BE AN HTTPS SERVER, HTTP is not allowed**:

![Download actions package](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/google-home/screenshots/09%20-%20Download%20Actions%20Package.png)

![Actions Package](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/google-home/screenshots/10%20-%20Actions%20Package.png)

7. Now, is time to recover the command you copied in the step 2. We are going to use the gactions CLI to upload our Actions Package. If you lost the command don't worry, just replace this one with your PACKAGE_NAME and the PROJECT_ID that you can find in your Google Actions project settings:

`gactions update --action_package PACKAGE_NAME --project PROJECT_ID`

![Project ID](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/google-home/screenshots/11%20-%20Project%20ID.png)

**This is probably the first time you are uploading an Actions Package to your project so you will need to authorize the access to your Google account. Copy & paste the URL that your console shows you once you enter the gactions update command, follow the steps and copy the authorization code and paste it into the console to finish the authorization process**

8. If everything went well, your actions were uploaded and you will be able to test your agent using your simulator or a Google Home deviced connected with the same Google account that you use for your project.

9. Go and test your agent until you are sure you are ready to submit it to review, after Google approval you agent will be publicly available.