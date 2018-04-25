---
title: Create Intent
layout: default
order: 4
---

# Create Intent Screen

This screen allows you to create intents from user examples. It also allows management of slots, webhooks, and responses. For more on all of those see below.

![Starting screen for conveyor]({{ "/img/screens/createIntent1.png" | absolute_url }})

1. **Domain** - Select an already existing domain from this dropdown list.
2. **Intent Name** - Give your intent a name.
3. **User Says** - In the first input box you can type in user examples and then press enter to add them to the list of examples. The se cond input box can be used to search through all of your examples. Simple intents may only require a few examples, but larger ones may benefit from the search bar. Finally in area below the inputs is where the examples you add will show up. Once they are here you can highlight any word or group of words to label them as an entity. Make sure to create the entities first!
4. **Slots** - Slots are values that an entity needs in order to be fulfilled. Sometimes slots are required (toppings on a pizza). They can also be lists (again pizza toppings is a good example). This box will automatially be populated by rows by highlighting entities in the User Says section. Once a slot shows up you can change it's name and indicate whether it is required and/or a list. Finally you can provide a prompt. If the slot is required the prompt is how the agent will ask for it if the user doesn't provide it (What toppings would you like on your pizza?).
5. **Webhook** - This toggle enables or disable webhook calls for Fulfillment. For more information on what fulfillment is see Concepts/Basic Chatbots/Fulfillment. Use this toggle to turn on a webhook call. This call will be made after the user request has been processed and after all required slots are filled. See below for configuring the webhook.

![Starting screen for conveyor]({{ "/img/screens/createIntent2.png" | absolute_url }})

6. **Agent Response** - You can use this section to build the response of your agent. Responses can be simple like `Hello` or `Goodbye`, but they can also use [handlebars](https://handlebarsjs.com) for advanced templating. By default they have access to a lot of template variables, for a complete list see Concepts/Conversation State Object. The logic here pre-filters the list to only those whose template parameters are available. If more than one response is deemed appropriate then a random one is chosen.
7. **Webhook Definition** - In an effort to make Articulate flexible in how it connects to APIs for fulfillment you can use this section to change the HTTP method. You can also use handlebars templating in the URL `{% raw %}http://my-api:8888/intent/{{intent.intentName}}{% endraw %}` and in the payload (JSON/XML):

```
{% raw %}
{
    "intent": {{intent.intentName}},
    "slots": {{JSONstringify slots}}
}
{% endraw %}
```