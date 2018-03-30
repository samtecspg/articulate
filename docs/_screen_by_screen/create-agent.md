---
title: Create Agent
layout: default
order: 1
---

# Create Agent Screen

This screen allows you to name and provide other details for your agent.

![Starting screen for conveyor]({{ "/img/screens/createAgent.png" | absolute_url }})

1. **Agent Name** - Pretty self explanatory, name your agent. *Names are unique within a single instance of Articulate.*
2. **Agent Description** - If you're only creating one agent this may not seem useful, but as you create multiple versions of agent to experiment with different solutions or as the number of agents grows the description can become more and more useful.
3. **Language** - Choose the language for your agent. For the moment a single agent can only have a single language. But we're working on making agents multi-lingual capabale.
4. **Default Time Zone** - Articualte used Duckling to parse dates and times. Those dates and times are normalized to UTC based on this field. But don't worry it's just a default request to converse with your agent can specify a custom timezone.
5. **Domain Recognition Threshold** - This one is a bit harder to explain. For more info see the Concepts/Dialogue. But in summary this slider controls when the bot uses the fallback responses. For example if you set it to .5 (50%) and a request gets parsed, but the best match only has a confidence of .43 then the fallback response would kick in.
6. **Fallback Responses** - These responses can be used when you agent doesn't understand requests. This is a last case fallback.