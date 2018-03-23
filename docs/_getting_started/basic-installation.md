---
title: Basic Installation
layout: default
order: 0
---

# Basic Installation

We have multiple approaches to getting conveyor running, the majority using Docker.   Unless you _really_ like doing things the hard way, or you have special hatred for Docker, we strongly recommend using one of the Docker installs to get yourself running.

#### Prerequistes

* Docker [Installed](https://docs.docker.com/engine/installation/) (Community Edition, if using recent versions)
* `docker-compose` [installed](https://docs.docker.com/compose/install/) (should be pre-installed for Docker on Mac or Windows)
* Git (installed by default on mac and most linux varieties. To install on windows go [here](https://git-for-windows.github.io))

| Warning  /  Be aware  /  Notice  /  Look out  / etc... |
|--------------------------------------------------------|
| Running this in docker starts 5 containers, that is a lot. On your system the default "max ram" for Docker may be too low. Please make sure Docker has a ram max of **at-least 4GB** before using Conveyor (known issue using Docker for Mac, and expected on Windows as well) <br> <br> If you receive a message like `conveyor_kibana_1 exited with code 137` then it means you need to give Docker more ram|

### Docker Installation
To get started


```
curl -L -O https://github.com/samtecspg/conveyor/releases/download/v1.0.0/conveyor-5.6.1-v1.0.0.zip
unzip conveyor-5.6.1-v1.0.0.zip
cd conveyor
docker-compose up
```

If all is going well you should see some output like the below:

```
[... LOTS building output ...]
Attaching to conveyor_elasticsearch_1, conveyor_node-red_1, conveyor_api_1, conveyor_kibana_1
[... Lots of log output ...]
kibana_1         | {"type":"log","@timestamp":"2017-10-09T21:10:48Z","tags":["status","plugin:elasticsearch@5.4.0","info"],"pid":1,"state":"green","message":"Status changed from yellow to green - Kibana index ready"
```

Once Kibana is green, you're ready to go!

Jump to [http://localhost:5601](http://localhost:5601/app/conveyor#/sources) and enjoy Conveyor. Get started by [creating your first channel](./channel-creation.html)
