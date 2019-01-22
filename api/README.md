# Overview

The project is based on [hpal](https://hapipal.com/) that provides a son set configuration based on the folder structure, the only thing that I disabled was model since they use an ORM different from what we will use.

## Plugins
First of all for hpal everything is a plugin, so we have 3 main ones

- `redis` 
- `rasa` (not created yet)
- `lib`

## Separation of concerns

The plugins are available to any piece of code that have access to the hapijs `server` object but even if that is the case we should always access the object in the correct places:

`route -> service -> model`

So in other words, even if a route have access to a model it should do so using the service and not directly. Or even if a model have access to the server object and the rest of the services it should not do it since is in the wrong direction.

## Models and Category Models

Not all models are the same and not all of them are going to be related to the database or to the models that hapijs will use.

For example we have a model that defines how and object will look in redis and expose the functionality to manipulate this object.

There will be another model for a rasa endpoint that will encapsulate the call to an endpoint and manage the response

And then there will be the category models, even if in our case there will be a 1:1 match with the rasa models this are going to be kept separate because their function will be different. 

The category models will be part of the route an provide validation (using Joi library) and also serves as documentation to build the swagger json.

In some cases we will need a `mapper` that will convert from one model to a category model or vise versa, this is because we will need to massage some properties before saving it to redis or when we read them and before sending it to eh UI.

# Plugins

## Redis plugin

Located at: `./plugin/redis`

This plugin have 2 main functions

- Setup a connection with redis (data source)
- Configure the redis models

In this folder we will find the redis models, this will contain all the properties and function calls to the DB.

Is model extends a our base model class and at the same time a [nohm](https://maritz.github.io/nohm/) class. The base class will expose some shorcut functions that are used across all modes like: findById, findAll, delete, etc. But this function will make use of nohm too.

** IMPORTANT **

The plugin will expose to the server is a Nohm client, we are not going to expose the redis client itself. So when we call `server.app.redis` we are getting the nohm client, and to get and specific model we use Nohm's factory to get it:

```
const AgentModel = server.app.redis.factory('Agent');
const agent = AgentModel.findById({id:1});

//we can use nohm directly to find an object by id but the above code looks more readable

const agent = server.app.redis.factory('Agent', 1);
```

## RASA Plugin

Located at: `./plugin/rasa` (not yet created)

This plugin have 2 main functions

- Setup an axios client with a defualt setting
- Configure the rasa models

The models will be initialized with the axios client 

```
module.exports = class Parse {

   constructor({axios}){
       this.client=axios;
   }

   async post({payload}){
       const result = await this.client.post(payload);
       // Do something with the result if needed.
       return result;
   }
};
```

Then we will call it from the service like this

```
const ParseModel = server.app.rasa.Parse;
const result = ParseModel.post({payload});
```

## lib plugin

Located at: `./lib`

This is the main application, where all the our business logic will be and wire everything together.

### Folders
- `./lib/models`: models used by hapijs routes
- `./lib/routes`: this is a combination between route configuration and controller, since the controllers are going to be really thin then it is fine to have it here. This will setup the route and the handler will ONLY get the data from the request, if any, and call the a service.
- `./lib/validators`: hapijs validators
- `./lib/routes`: Will contain the business logic as granular as needed, services can call each other so we can reuse the code where we need it. We might need to do a better organization of the files in this folder since the number of files will grow.

# Notes

- We are using the latest JS functions like import, async, await, etc. To have code that is easier to read, mostly by the use of await/async so we don't have a ton of callbacks.

- Nohm and hapijs provides its own validation methods, I decided not to use nohm at all and just validate when an endpoint is called instead of having to double the validations in both places.
