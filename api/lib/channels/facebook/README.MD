# FACEBOOK CHANNEL

This connector will allow sending messages from between Facebook Messenger and Articulate's agents

## Configuration

1. Create your Facebook app using the [developer console](https://developers.facebook.com/). Once you create your app you should be in your app dashboard that will look somehow like this:

![Facebook APP Dashboard](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/facebook/screenshots/01%20-%20App%20Dashboard.png)
 
2. Once in the dashboard click on the plus sign to add a new product and then click on Set Up in the messenger product

![Messenger product set up](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/facebook/screenshots/02%20-%20Products%20%2B%20Set%20UP.png)

3. In the Set Up screen of Messenger go to the Access Tokens section and select your Facebook Page where you are going to host your agent. Once you select it, click on Edit Permissions button and 

![Facebook page selection](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/facebook/screenshots/03%20-%20Page%20Selection.png)

![Page permissons](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/facebook/screenshots/04%20-%20Permissons.png)

4. Now you should have a Page Access Token that you need to copy to the details section of the connection you are creating in Articulate

![Articulate's Facebook connection details](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/facebook/screenshots/05%20-%20Articulate%20Page%20Access%20Token.png)

5. For the App Secret value that you need to add to your connection go to the Settings > Basic section in your Facebook app, and then, click in the "Show" button where the value is. Copy this value and paste it in the connection details tab in Articulate where it goes.

![Facebook app secret](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/facebook/screenshots/06%20-%20App%20Secret.png)

6. Once you copy the value to the Articulate UI hit the Save button. This will redirect you to the Connection tab where you will see a reference to the address Facebook will use as webhook URL and the verify token that you need to pass to Facebook to verify this URL.

![New connection saved](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/facebook/screenshots/07%20-%20Connection%20Saved.png)

7. Go to your Facebook App again and start to set up the webhook. For this just go to the Webhooks section in the Messenger product config and hit Subscribe to Events.

![Subscription to events](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/facebook/screenshots/08%20-%20Subscribe%20To%20Events.png)

8. Copy the values provided by Articulate in the webhook configuration dialog and enable the subscription for *messages* and *messaging_postbacks*. Then hit the "Verify and Save" button. Notice that you will need that your server is publicly accessible so Facebook can verify your webhook URL.

![Webhook save and verification](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/facebook/screenshots/09%20-%20Verify%20and%20Save.png)

9. If your webhook address was verified by Facebook now you should be able to subscribe your page (the same page of step 3 and 4) to your webhook. Subscribe it.

![Page subscription to webhook](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/facebook/screenshots/10%20-%20Page%20subscription.png)

10. Verify our page was subscribed as in the following image: 

![Page subscribed](https://github.com/samtecspg/articulate/blob/master/api/lib/channels/facebook/screenshots/11%20-%20Page%20subscribed.png)

11. Now you are all set to test your agent by messaging with your account to the facebook page you subscribed. Please notice that your Facebook app is in development mode, test it until you are sure you are ready to submit it to review, until after Facebook approval you agent will be publicly available.