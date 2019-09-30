# Action Chains

Hopefully you've already read over what an action is, how sayings can be tagged with actions, and are familair with the action screen.

After you've finished performing some action for the user you may want to follow that up with some other action. For example, after greeting a user you may want to ask if they need help. You could do this by chaining an `Ask For Help` acton to the responses of your `Greet` acton. Here's what that looks like:

![Simple Action Chain](./img/chains/offer-help.PNG)


## Separation of Concerns

The above is an example of separation of concerns. You could have your greet action ask if the user needed help, but that's not really what the `Greet` acton is for. This is the first use case for action chaining.


## Slot Driven Dialogue

In the above example all responses chained to the same action. But using handlebars it is possible to chain certain actions to certain responses. For example If the user asks for insurance help you may prompt them to idtenify their concern as auto, home, or life insurance. You could then chain to a specific follow-up action based on their selection.




## Webhook Driven

Similarily to the above perhaps you ask the user for their policy ID number and use a webhook to identify that type of insurance policy that number is attached to. You could then use the webhook result to route the user to different actions.

