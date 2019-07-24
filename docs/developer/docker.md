# Docker Usage

We use Docker and docker-compose to run Articulate. Our usage has some more advnaced elements, which we'll document here.

### docker-compose.yml

When you run the command `docker-compose up` compose uses both `docker-compose.yml` and `docker-compose.override.yml` to start up all of the services. This is particularly useful because it allows us to specify things that change very commonly like ports and volumes.

 - `docker-compose.yml` - for the most part contains configurations that are true for the most common configurations. Or thigns that can be easily overriden by compose.
 - `docker-compose.override.yml` - contains configurations that are true for most common configurations, but cannot be easily changed by overrides.

The best example of this would be ports. If `docker-compose.yml` contained ports, then any overrides wouldn't actually override those ports they would be merged. This isn't desireable behavior. So we put ports in the `docker-compose.override.yml` file so that other overrides can change that configuration.

## Overrides

To execute compose with an override the command should look like the below:

```
docker-compose -f docker-compose.yml -f compose/build-compose.yml up
```

In this case all of the basic settings are pulled from the main compose file, but then the build-compose.yml file overrides some settings. Below is a list of the overrides we provide and their use cases:

### build-compose.yml

By default `docker-compose.yml` pulls the latest images from Docker Hub, but sometimes you may want to build locally. To build locally you can use the bellow overrider.

```
docker-compose -f docker-compose.yml -f compose/build-compose.yml build
```

To build individual services you can add the name of the service on to the end of the command. In the below case we are building just the UI and API.

```
docker-compose -f docker-compose.yml -f compose/build-compose.yml build api ui
```

This compose doesn't have any ports exposed, and should really only be used for building. Once you've built locally you can simple run `docker-compose up` and it will use the built images.

### develop-compose.yml

This compose is used for development work. Specifically it uses an alternate Dockerfile for the UI to run in a development mode rather than production. This prevents the UI from being bundled and provides better UI error messages.

```
docker-compose -f docker-compose.yml -f compose/develop-compose.yml build
```

### gateway-compose.yml

The default compose and the develop compose expect all of the services to be running in Docker in the network created by compose. However for development it is often beneficial to run the UI and API directly on your machine rather than in Docker. The `gateway-compose.yml` override changes the nginx configuration to point to docker's local IP.

```
docker-compose -f docker-compose.yml -f compose/gateway-compose.yml build
```

For more complete developer documentations [see here](./getting-started.md).

### kibana-compose.yml

Articulate uses Elasticearch to store historical use information and full conversation histories. It can be useful to run Kibana for development, debug, and exploratory purposes.

```
docker-compose -f docker-compose.yml -f compose/kibana-compose.yml build
```

### ssl-compose.yml

For cloud deployment nginx needs to be modified to run with SSL. We ahve this setup process largely automated. For more information see the [Advanced Installation](../getting-started/advanced-installation.md) instructions.