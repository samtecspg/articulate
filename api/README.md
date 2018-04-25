# NLU API

This RESTful API helps in the management of entities, intents, and domains. Alongside, it exposes the parsing action, and also the management of parsed documents. It is based on [Rasa](https://rasa.ai/) for the NLU task, and also makes use of [Duckling](https://github.com/facebookincubator/duckling) to parse the text into structured data. For data persistence we are using [ElasticSearch](https://www.elastic.co/products/elasticsearch), and for development tasks, we use [Kibana](https://www.elastic.co/products/kibana).

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You will need `node.js` up and running your local machine. If you haven't installed it yet go to [node.js downloading page](https://nodejs.org/en/download/).

For dependency management, we use `yarn`. If you don't have `yarn` installed follow this [installing instructions](https://yarnpkg.com/en/docs/install).

To support the Rasa, Duckling, ElasticSearch and Kibana instances we use [docker](https://www.docker.com/) and `docker-compose`.

### Installing

Clone your project in your local machine:

```
git clone https://github.com/samtecspg/alpha-nlu-api.git
```

Install the dependencies:

```
yarn install
```

We provide a `docker-compose` file with Rasa, Duckling, ElasticSearch and Kibana. This compose file includes the api service. :warning: If you are going to modify the api code comment the complete `api` section of the file. To start containers run:

```
docker-compose up -d
```

In order to get things running, you will need to add a `.env` file in your project directory. The expected content on this file is descibed on [.env.example](./.env.example)

To initialize the NLU API run:

```
npm run start:server
```

Test the system, go to [http://localhost:7500/documentation](http://localhost:7500/documentation) and explore the API.

:information_source: The NLU API will check every time it is started that the ES's indexes structure are valid. If not, the API will automatically stop.

### Parsing your first document

The NLU API represents a model of language trough domains. We defined a domain as a set of entities and intents, that are trained using an NLP engine in order to provide a model that is capable of recognize external examples of intents and entities. To create your first domain, you will ned a set of intents and entities that are going to be linked to your test domain. 

We provide test data for [intents](./test-data/intents.json) and [entities](./test-data/entities.json) in order to help you out in the creation of simple domain. This data is based on Rasa simple restaurant search bot [tutorial](https://rasa-nlu.readthedocs.io/en/latest/tutorial.html).

Use the `POST /intent/batch` and `POST /entity/batch` endpoints to create intents and entities respectively using the test data provided.

Take note of the ids returned by the API for each intent and entity, and with those ids, create a json object like this:

```
{
	"name": "restaurant",
	"entities": [
		"6d1347da-fe6b-5a5d-c8e8-ca1f1b6d253f",
		...
	],
	"intents": [
		"aa5b0716-6992-089f-36a9-1e88be9a0138",
		...
	]
}
```

`POST` this object to the `/domain` endpoint, and that will return your new domain. From now on, you are ready to parse your first document, since back scenes a model was trained with Rasa.

To parse documents use the `/parse` endpoint of the API. Remember to navigate the swagger file on `/documentation` in your browser to get more information about endpoints, but for now, you just need to know that the `/parse` endpoint receives a query param called `text`.

Call `http://localhost:7500/parse` and pass the `text` param with `show me spanish places in the center for today` string. If you have your API service running click [here](http://localhost:7500/parse?text=show%20me%20spanish%20places%20in%20the%20center%20for%20today) and you will have your first document parsed.

You can check the documents parsing history at the `doc` endpoint.

### Understanding the output

* `id`: unique identifier of the document
* `document`: text to parse
* `time_stamp`: date and time when document was parsed
* `results`:
  * `duckling`: an array of outputs from the duckling parse service. You will have as many results as elements were recognized in the text. To know more go to [Duckling project home page](https://github.com/facebookincubator/duckling)
  * `rasa`: an array of outputs from Rasa parse endpoint. Given that you can have more than one domain in your API, by default the API will parse the text for each domain. You can modify this by adding the `domain` parameter in the call to the `/parse` endpoint.
* `maximum_intent_score`: maximum confidence obtained for an intent between all domains
* `total_elapsed_time`: total time of running the parsing process, without saving on elastic search time.

## Tests

We test every endpoint using [Lab](https://github.com/hapijs/lab). To run the tests, run:

```
npm test
```

### Coding Style Tests

We are using the linting rules provided by `Lab`. Every time you run the tests or make a commit or push to the repo `Lab` will run the tests with linting. Please adjust your coding style to fulfill this standard. `Lab` linting is based on [ESLint](http://eslint.org/)

## Deployment

Once you passed all tests and you feel ready to deploy your system, just start your containers in your deployment environment with `docker-compose up -d`. :warning: Remember to uncomment the `api` section in the compose file if you did so. Also, check your `.env`. If you want to deploy this API without any changes leave the `.env` file empty.

## Built With

* [Hapi.js](https://hapijs.com/) - A rich framework for building applications and services
* [Lab](https://github.com/hapijs/lab) - Simple test utility for node
* [Rasa](https://rasa.ai/) - Open source conversational AI
* [Duckling](https://github.com/facebookincubator/duckling) - Haskell library that parses text into structured data
* [ElasticSearch](https://www.elastic.co/products/elasticsearch) - Distributed, RESTful search and analytics engine

## Authors

* **Smart Platform Group** - *Samtec* - [SamtecSPG](https://github.com/samtecspg)
