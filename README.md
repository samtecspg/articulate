![articulate logo](./docs/img/articulate-logo.png)

## A platform for building conversational interfaces with intelligent agents

[![Join the chat at https://gitter.im/samtecspg/articulate](https://badges.gitter.im/samtecspg/articulate.svg)](https://gitter.im/samtecspg/articulate?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Documentation

https://samtecspg.github.io/articulate/

## QUICK START

**If installing on a public host or on a docker host that uses a 192.168, etc type IP please ensure you create a .env file and put the below values in it so the application will work as expected**

`DOCKER_HOST=ip_address_here

 SWAGGER_HOST=same_ip_address
 
 API_URL=http://same_ip_address:8000`
 


1. Make sure you have Docker and `docker-compose` installed:

   * [Docker](https://docs.docker.com/engine/installation/) (If faced with any choices, get the Community Edition ("CE"))
   * [`docker-compose`](https://docs.docker.com/compose/install/) (should be auto-installed as part of Docker on mac and windows)

2. Download the current release zip (articulate-vX.X.X.zip): https://github.com/samtecspg/articulate/releases/latest

3. Unzip and get a terminal or CMD in the release directory

4. run `docker-compose up` (`sudo` might be needed, you can use -d after the up for it to be a daemon and run in the background)

5. point your web browser at  http://localhost:3000 and enjoy Articulate

## License
```
Copyright 2018 Samtec.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

