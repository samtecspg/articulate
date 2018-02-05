# Local builds

As of Feb 4 2018, `docker-compose.yml` pulls the most recent build from dockerhub instead of locally building.

To do development builds, the compose needs to be augmented with the info that is in `build-compose-override.yml`

So to enable docker-compose to work locally use the following auguments to compose: 

```docker-compose -f docker-compose.yml -f build-compose-override.yml XXXX```

[`XXXX` being what ever compose command you wanted to run, `up`, `down`, `build api`, etc)
