# MATTERMOST CHANNEL

This connector will allow sending messages between Mattermost and your agents

## Prerequisites

The following options should be enabled by Mattermost admin using the System Console
1. Enable Incoming Webhooks.
2. Enable Outgoing Webhooks.
3. Enable Custom Slash Commands.
4. Enable Integrations to Override Usernames.

## Channel Considerations

To create a way of communication between Mattermost and your agents, we have to define two means. The first one is a specific channel in which every message you post will be received by the agent. The second one is a slash command that can be used from any public, private or direct message channel and will be received by your agent

## Create an Incoming Webhook

1. From the main menu, select Integrations, you should get a screen like this

![Integrations Screen](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/mattermost/screenshots/1%20-%205%20-%2010%20Integrations%20Screen.png)

2. Select the option to create an Incoming Webhook and the following screen shows up

![IW Create](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/mattermost/screenshots/2%20-%20Incoming%20Webhook%20Create.png)

3. Select Add Incoming Webhook, fill the information and save the WebHook

![IW Information](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/mattermost/screenshots/3%20-%20Incoming%20Webhook%20Information.png)

Note that you have to specify a Channel as the default receiver for your Agent, but do not select the option to lock on this channel so your agent can post messages in any channel. After saving the webhook the following information shows up

![IW Created](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/mattermost/screenshots/4%20-%20Incoming%20Webhook%20Created.png)

Please copy this URL in a safeplace so it can be used by your agent. Anyone with this URL can post to your Webhook, so keep it somewhere safe

After you click Done, the Incoming Webhook should be created

## Creation of an Outgoing Webhook

To enable a specific channel to communicate with your agent, you have to create an Outgoing Webhook following these steps

1. From the main menu, select Integrations, you should get a screen like this

![Integrations Screen](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/mattermost/screenshots/1%20-%205%20-%2010%20Integrations%20Screen.png)

2. Select the option to create an Outgoing Webhook and the following screen shows up

![OW Create](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/mattermost/screenshots/6%20-%20Outgoing%20Webhook%20Create.png)

3. Select Add Outgoing Webhook, fill the information and save the WebHook

![OW Information 1](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/mattermost/screenshots/7%20-%20Outgoing%20Webhook%20Information%201.png)

In this case you should specify a Channel that should be already created, this will be the Channel in Mattermost used to communicate with your agent

![OW Information 2](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/mattermost/screenshots/8%20-%20Outgoing%20Webhook%20Information%202.png)

Note that the field for callback URL is required, but for now we don't have this URL because we have not created the Agent's Mattermost Connection, so put any placeholder until we do. After saving the webhook the following information shows up

![OW Created](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/mattermost/screenshots/9%20-%20Outgoing%20Webhook%20Created.png)

Please copy this Token in a safe place so it can be used by your agent. This token will be used to verify that Mattermost is the real sender of the messages

After you click Done, the Outgoing Webhook should be created

## Creation of a Slash Command

1. From the main menu, select Integrations, you should get a screen like this

![Integrations Screen 2](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/mattermost/screenshots/1%20-%205%20-%2010%20Integrations%20Screen.png)

2. Select the option to create a Slash Command and the following screen shows up

![SC Create](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/mattermost/screenshots/11%20-%20Slash%20Command%20Create.png)

3. Select Add Slash Command, fill the information and save the Slash Command

![SC Information 1](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/mattermost/screenshots/12%20-%20Slash%20Command%20Information%201.png)

![SC Information 2](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/mattermost/screenshots/13%20-%20Slash%20Command%20Information%202.png)

Note that the field for Request URL is required, but for now we don't have this URL because we have not created the Agent's Mattermost Connection, so put any placeholder until we do. After saving the Slash Command the following information shows up

![SC Created](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/mattermost/screenshots/14%20-%20Slash%20Command%20Created.png)

Please copy this Token in a safe place so it can be used by your agent. This token will be used to verify that Mattermost is the real sender of the messages

After you click Done, the Slash Command should be created

### Create Mattermost Connection from Articulate

To create the connection from Articulate, go to the Agents screen and select Create Connection

![Art Connections](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/mattermost/screenshots/15%20-%20Articulate%20Connection%20Create.png)

Then select the Agent you want to communicate with Mattermost and the Mattermost Connection button

![Art Mattermost Icon](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/mattermost/screenshots/16%20-%20Articulate%20Mattermost%20Icon.png)

Select Details tab and fill the following data

![Art Mattermost Information](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/mattermost/screenshots/17%20-%20Articulate%20Mattermost%20Information.png)

The user name is the name used by your agent to post messages. The user selections prefix field is a prefix that is going to be used to identify the dialogues of the user when using Slash Commands or Selecting Quick Responses.
The tokens and Incoming Webhook URL were generated when we created the Slash Command and the Webhook 

After doing that and save the connection, you can return to the connection tab and see that there is a string named Callback URL, this is the value to replace the placeholders in the Outgoing Webhook and in the Slash Command

![Art Mattermost Callback URL](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/mattermost/screenshots/18%20-%20Articulate%20Callback%20URL%20Placeholder.png)

Return to the Integrations Page in Mattermost and select edit to your Outgoing Webhook and then change your placeholder to the Real Value and select update

![Art Mattermost OW](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/mattermost/screenshots/19%20-%20Articulate%20OW%20Edit.png)

![Art Mattermost OW Placeholder](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/mattermost/screenshots/20%20-%20Articulate%20OW%20placeholder%20change.png)

Return to the Integrations Page in Mattermost and select edit to your Slash Command then change your placeholder to the Real Value and select update

![Art Mattermost SC](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/mattermost/screenshots/21%20-%20Articulate%20SC%20Edit.png)

![Art Mattermost SC Placeholder](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/mattermost/screenshots/22%20-%20Articulate%20SC%20placeholder%20change.png)

Following this steps will make the communication between Mattermost and your agent possible
After following the entire process you should be able to talk to your agent from mattermost directly to the channel you selected or using the Slash Command defined

![Usage](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/mattermost/screenshots/23%20-%20Articulate%20Mattermost%20Use.png)


