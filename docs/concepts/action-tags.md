<div class="tut">

# Action Tagging

Whenever a user says something to your agent they are trying to do something, even if that something is just say hello. What the user is trying to accomplish is called an action. To train articulate to respond to user requests you will provide it with a list of sayings, sayings the user might make to your agent. Each of those sayings will get tagged with an action corresponding to what Articualte should do to fulfill the users request.

![Sayings Page](./img/getting-started/sayings.PNG)

## Sayings

To greet your agent a user may say or type any number of things: hi, hello, howdy, hola, greetings, etc. To teach Articulate to respond to a greetings you would type all of these examples in as sayings. The sayings you provide don't need to be an exhaustive list of every possible thing a user could say. Articulate will learn to generalize from the sayings you do provide.


## Tagging

Adding sayings isn't enough to teach articulate how to respond. You also need to tag each saying with the action Articulate should take when it hears that saying or a similar one. 


## Multi Actions

Sometimes one sayings from the user may mean multiple actions for Articulate. For example if the user says, "Hello, can I get a pizza?" You might want your agent to greet the user and help them order a pizza. You could add this example as a saying and then tag it with multiple actions.

But multi actions don't have to be so obvious. For example you may have two actions in your agent already: `Get Temperature` for when the user asks "What's the temperature?" and `Get Humidity` for when the user asks "What's the humidity?" Rather than creating an entirely new action for when the user asks, "What's the weather going to be like?" You could instead choose to tag that saying with both the `Get Humidity` and `Get Temperature` actions.

![Multi Action Tags](./img/getting-started/sayings-multi-action.PNG)

</div>

<Note type="tip">

Responses can also be tagged with actions. We call this [Action Chaining](./action-chains.md) and it's one of the primary ways of achieving advanced dialogue in Articulate.

</Note>