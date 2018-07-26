---
title: Basic Installation
layout: default
order: 0
---

# Basic Installation

The easiest way to get started with Articulate is to use our included `docker-compose` file. Articulate relies on several services besides it's own UI and API. These all get started when you use the provided compose.

| | Warning  /  Be aware  /  Notice  /  Look out  / etc... |
|---------|--------------------------------------------------------|
| **Memory Requirement** | Loading and Training these language models dictates a certain amount of RAM. For experimenting with smaller agents 3Gb may be sufficient, but for larger agents much more RAM may be required. If training takes more than a few minutes for small agents or more than half an hour for large agents, it is a good indicator that you are running low on memory. |
| **Windows Shared Drives** | On Windows, make sure you have shared the drive with Docker so that it can mount directories inside of the container. |
| **Docker Toolbox** | The below instructions work best on Linux and when using *Docker for Windows* or *Docker for Mac*. If you are using Docker toolbox follow the remote installation instructions to specify the docker machine IP via the `API_URL` environment variable. |

## Setup

1. **Installing Prerequisites** - Make sure you have Docker, Docker Compose, and Git installed:

   * [Docker](https://docs.docker.com/engine/installation/) (If faced with any choices, get the Community Edition ("CE"))
   * [Docker Compose](https://docs.docker.com/compose/install/) (should be auto-installed as part of Docker on mac and windows)
   * Git (installed by default on mac and most linux varieties. To install on windows get it [here](https://git-for-windows.github.io))

2. **Downloading** - Download the current release from this page: [https://github.com/samtecspg/articulate/releases/latest](https://github.com/samtecspg/articulate/releases/latest)

3. **Extracting** - Unzip and get a terminal or command prompt in the new  directory

Once you've got everything extracted you're ready to start Articulate. The below instructions cover running locally and in the cloud:

### Running Locally

This is the simplest setup and for most people wont required anything more than:

```
docker-compose up
```

A few gotchas:
 - `sudo` may be required
 - On Windows this will only work on Windows 10 running *Docker for Windows*

After Docker downloads the images and starts all of them Articulate should be available at [http://localhost:3000](http://localhost:3000) and the API documentation should be available at [http://localhost:7500/documentation](http://localhost:7500/documentation)

### Running Remotely

The only extra requirement when running this way is an environment variable which informs the UI where to look for the API (the public url).

```
API_URL=http://xxx.xx.xx.xx:7500 docker-compose up
```

Exceptions:
 - replace the `x`s with your public IP or url
 - `sudo` may be required
 - On Windows specifying environment variables is a little bit more involved. The easiest way is to modify the `docker-compose.yml` file. Replace the ui service with something like this:
 ```
 ui:
  image: samtecspg/articulate-ui:repo-head
  ports: ['0.0.0.0:3000:3000']
  networks: ['alpha-nlu-network']
  environment:
    - API_URL=http://xxx.xx.xx.xx:7500
 ```
