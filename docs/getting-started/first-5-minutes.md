<div class="tut">

# Your First Agent in 5 Minutes

For your first few minutes in Articulate, let's create a simple Hello World chatbot.

Here's how we suggest spending your first 5 minutes with Articulate:

## Create an Agent

1. From the main Articulate screen, a.k.a the Agent List screen, a.k.a the home screen: click **Create Agent**.

![Articulate Home Screen](./img/getting-started/home.PNG)


2. Now you're on the [Create Agent](../screens/agent.md) screen. Click that link to find out what every thing does, but for your first agent, just give it a **name** and a **description**.

![Create Agent Screen](./img/getting-started/create-agent.PNG)


3. If you're finished with that, click **save**. Doing that will land you on the [Sayings](../screens/sayings.md) page.

![Sayings Page](./img/getting-started/sayings-empty.PNG)

## Create a Category

4. Now that you have an agent the first thing you should do is create a category. Think of a category as a group of similar actions. From the Sayings page, click on categories dropdown. For now the list is empty, click **Add** to create your first category.

![Add a Category](./img/getting-started/category-dropdown-empty.PNG)

5. Our first category is going to be a really simple one to handle hellos and goodbyes. This is traditionally called _small talk_. Give your first category a **name**.

![Create a Category](./img/getting-started/create-category.PNG)

6. Click **Save** to save your category and return to the sayings page. Note that your new category is already selected in the category dropdown.

## Create an Action

7. Now that we've got a category we need to create an action. Actions are how your agent will respond to incoming requests. Click the Plus button in the sayings input then click Add to create a new action.

![Add an Action](./img/getting-started/action-dropdown-empty.PNG)

8. Advanced actions can use Webhooks to fetch data and Handlebars to format responses, but the most basic action will have just two things: a Name and a plain text response. Give your action a **name**.

![Create an Action](./img/getting-started/create-action-main.PNG)

9. Now click on the response tab. In the input type how your agent respond for this action and hit enter. Hitting enter adds that response, an action can have multuple responses.

![Add a Response](./img/getting-started/create-action-response.PNG)

10. Now you've got your first action. Click **Save** and **Exit** to get back to the Sayings page. Note how your new actions is automatically selected in the sayings input.

## Add some Sayings

11. You're ready to add your first few sayings. Sayings teach Articulate which acton to use for a given utterance from the user. You don't need to type every possible thing your users might ask, Articulate uses machine learning to generalize. Type in a few sayings and after each hit **enter**. Notice how the sayings are added to the list with the `Greet` tag you created above.

![Add some Sayings](./img/getting-started/sayings.PNG)

12. To make this agent a little but more interesting repeat steps 7 through 11 to create another action and give Articulate some sayings for that new action. For example create a **Goodbye** action with a response of **Goodbye cruel world** and the below sayings.

![Add Another Action](./img/getting-started/sayings-more.PNG)

## Train Your Agent

13. You may have noticed the text no the page which says _training needed_. It's time to take care of that. Anytime you add more sayings to your agent you will see the status of the agent change. click *Train* to train your agent now. Once training is complete the status will update to show `Trained just now`. Once it shows this you are ready to start chatting with your agent.

![Train your Agent](./img/getting-started/training-complete.PNG)

## Test your agent

14. There is a chat panel for testing your agent in Articulate. If it's not open already then click **Open Chat** to show it.

15. Go ahead and say hello to your agent.

![Hello World](./img/getting-started/hello-world.PNG)

## Review Your Tests

16. Keeping the chat panel open, switch to the review page. If you've already said something to your agent you should see it in the list of sayings. You can also see the confidence score Articualte assigned to it. In the above screenshot the saying `hello` had a 96.59% confidence.

![Review Page](./img/getting-started/review.PNG)

17. To try a saying again click the play button next to it. This copies the saying into the chat panel.

![Play Button](./img/getting-started/play.PNG)

18. But the real purpose of the chat panel is to help you make your agent better. For example try saying `cya` to your agent. This saying isn't recognized by Articulate, in fact it has a non-existent confidence score, which means Articualte doesn't even know that word.

![C-Ya](./img/getting-started/play.PNG)

19. But this is where the reivew page comes in. Click the **Copy** button to copy that saying into your training data.



</div>