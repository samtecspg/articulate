# ROCKET.CHAT CHANNEL

This connector will allow sending messages between your Rocket.Chat server and your agents

## Prerequisites

1. Admin access to your Rocket.Chat server
2. [Create a bot user](https://rocket.chat/docs/bots/creating-bot-users/)

## Configuration

1. In Articulate UI create a connection between Rocket.Chat and your agent. Fill the details with the hostname, bot username, and bot password.

![Connection Details](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/rockechat/screenshots/01%20-%20Connection%20Details.png)

2. It's time to configure your Rocket.Chat incoming integration. For this, copy the Callback URL provided by Articulate. In case it isn't complete, please change the proper values to point to your public Articulate API server address.

3. Now go to Rocket.Chat administration panel and click on Integrations. Then in the integrations screen, click in the upper right corner to add a *New Integration*.

4. Select the *Outgoing WebHook* option.

5. In the Event Trigger dropdown select Message Sent.

6. The default value of your integration is to be disabled, so make sure to enable it.

7. Give it a name, which is optional, but good to identify your integations if you have more than one.

8. Now is time to configure what channels is your bot listening. You can enter as many values as you want separated by commas.

9. You can also set trigger words if you think that will help to enhance the user experience.

10. Paste the callback URL provided by Articulate in the URLs textbox.

11. In the *Post as* please type your bot user name.

12. Check out the other settings in case you want to personalize your bot settings, but defaults values are good to go.

13. Save your changes. Your configuration should look somehting like this:

![Integration Settings Summary](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/rockechat/screenshots/02%20-%20Integration%20Settings%2001.png)

![Integration Settings Summary](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/rockechat/screenshots/02%20-%20Integration%20Settings%2002.png)

14. Now based on the values you specified on the step 8, make a test of your bot. It should work now.
