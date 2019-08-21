# MATTERMOST CHANNEL

This connector will allow sending messages between Mattermost and your agents

## Prerequisites

The following options should be enabled by Mattermost admin using the System Console
1. Enable Incoming Webhooks.
2. Enable Outgoing Webhooks.
3. Enable Custom Slash Commands.
4. Enable Integrations to Override Usernames.

## Channel Considerations

To create a way of communication between Mattermost and your agents, we support two options. The first one is to create a specific channel in which every message you post will be received by the agent. The second one is to create a slash command that can be used from any public, private or direct message channel and will be received by your agent.


## Basic Configuration for both options

This steps are needed for any of the options that you choose. So please don't skip this section regardless of your choice.

### Create an Incoming Webhook

1. From the main menu, select Integrations, you should get a screen like this:

![Integrations Screen](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/google-home/screenshots/01%20-%20Google%20Actions%20Console.png)

2. Select the option to create an Incoming Webhook and the following screen shows up:

![Development Experience](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/google-home/screenshots/03%20-%20New%20Project%20Screen.png)

3. Select Add Incoming Webhook, fill the information and save the WebHook:

![Google Action Overview](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/google-home/screenshots/05%20-%20Decide%20display%20name.png)

Note that you have to specify a Channel as the default receiver for your Agent, but do not select the option to lock on this channel so your agent can post messages in any channel. After saving the webhook the following information shows up:

![Google Action Overview](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/google-home/screenshots/05%20-%20Decide%20display%20name.png)

Please copy this URL in a safeplace so it can be used by your agent. Anyone with this URL can post to your Webhook, so keep it somewhere safe.

After you click Done, the Incoming Webhook should be created.

## Option 1 : Creation of an Outgoing Webhook for specific channel

If you want to have a specific channel to communicate with your agent, you have to create an Outgoing Webhook following these steps: 

1. From the main menu, select Integrations, you should get a screen like this:

![Integrations Screen](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/google-home/screenshots/01%20-%20Google%20Actions%20Console.png)

2. Select the option to create an Outgoing Webhook and the following screen shows up:

![Development Experience](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/google-home/screenshots/03%20-%20New%20Project%20Screen.png)

3. Select Add Outgoing Webhook, fill the information and save the WebHook:

![Download actions package](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/google-home/screenshots/09%20-%20Download%20Actions%20Package.png)

In this case you should specify a Channel that should be already created, this will be the Channel in Mattermost used to communicate with your agent.

![Download actions package](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/google-home/screenshots/09%20-%20Download%20Actions%20Package.png)

Note that the field for callback URL is required, but for now we don't have this URL because we have not created the Agent's Mattermost Connection, so put any placeholder until we do. After saving the webhook the following information shows up:

![Google Action Overview](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/google-home/screenshots/05%20-%20Decide%20display%20name.png)

Please copy this Token in a safe place so it can be used by your agent. This token will be used to verify that Mattermost is the real sender of the messages.

After you click Done, the Outgoing Webhook should be created.

## Option 2 : Creation of a Slash Command for any channel

1. From the main menu, select Integrations, you should get a screen like this:

![Integrations Screen](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/google-home/screenshots/01%20-%20Google%20Actions%20Console.png)

2. Select the option to create a Slash Command and the following screen shows up:

![Integrations Screen](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/google-home/screenshots/01%20-%20Google%20Actions%20Console.png)

3. Select Add Slash Command, fill the information and save the Slash Command:

![Integrations Screen](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/google-home/screenshots/01%20-%20Google%20Actions%20Console.png)

![Integrations Screen](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/google-home/screenshots/01%20-%20Google%20Actions%20Console.png)

Note that the field for Request URL is required, but for now we don't have this URL because we have not created the Agent's Mattermost Connection, so put any placeholder until we do. After saving the Slash Command the following information shows up:

![Integrations Screen](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/google-home/screenshots/01%20-%20Google%20Actions%20Console.png)

Please copy this Token in a safe place so it can be used by your agent. This token will be used to verify that Mattermost is the real sender of the messages.

After you click Done, the Slash Command should be created.

### Create the Mattermost Connection from Articulate

To create the connection from Articulate, go to the Agents screen and select Create Connection

![Integrations Screen](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/google-home/screenshots/01%20-%20Google%20Actions%20Console.png)

Then select the Agent you want to communicate with Mattermost and the Mattermost Connection button

![Integrations Screen](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/google-home/screenshots/01%20-%20Google%20Actions%20Console.png)

Select Details tab and fill the following data:

![Integrations Screen](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/google-home/screenshots/01%20-%20Google%20Actions%20Console.png)

The user name is the name used by your agente to post messages. The user selections prefix field is a prefix that is going to be used to Identify the dialogues of the user when using Slash Commands or Selecting Quick Responses.
The tokens were generated when we created the Slash Command and the Webhook, and also the Incoming Webhook URL.

After doing that and save the connection, you can return to the connection tab and see that there is a string named Callback URL, this is the value to replace the placeholders in the Outgoing Webhook and in the Slash Command. First, return to the Integrations Page in Mattermost and select edit to your Incoming Webhook

![Integrations Screen](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/google-home/screenshots/01%20-%20Google%20Actions%20Console.png)

And the change your placeholder to the Real Value and select update:

![Integrations Screen](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/google-home/screenshots/01%20-%20Google%20Actions%20Console.png)

Return to the Integrations Page in Mattermost and select edit to your Slash Command

![Integrations Screen](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/google-home/screenshots/01%20-%20Google%20Actions%20Console.png)

Following this steps will make the communication between Mattermost and your agent possible

After following the entire process you should be able to talk to your agent from mattermost directly to the channel you selected or using the Slash Command defined.

![Integrations Screen](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/google-home/screenshots/01%20-%20Google%20Actions%20Console.png)


