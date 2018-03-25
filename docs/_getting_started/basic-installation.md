---
title: Basic Installation
layout: default
order: 0
---

# Basic Installation

The easiest way to get started with Articulate is to use our included `docker-compose` file. Articulate relies on several services besides it's own UI and API. These all get started when you use the provided compose.

#### Prerequistes

* Docker [Installed](https://docs.docker.com/engine/installation/) (Community Edition, if using recent versions)
* `docker-compose` [installed](https://docs.docker.com/compose/install/) (should be pre-installed for Docker on Mac or Windows)
* Git (installed by default on mac and most linux varieties. To install on windows go [here](https://git-for-windows.github.io))

| Warning  /  Be aware  /  Notice  /  Look out  / etc... |
|--------------------------------------------------------|
| Loading and Training these language models dictates a certain amount of RAM. For experimenting with smaller agents 2Gb may be sufficient, but for larger agents much more RAM may be required. If training takes more than a few minutes for small agents or more than half an hour for large agents, it is a good indicator that you are running low on memory. |

### Docker Installation
To get started

1. Make sure you have Docker and `docker-compose` installed:

   * [Docker](https://docs.docker.com/engine/installation/) (If faced with any choices, get the Community Edition ("CE"))
   * [`docker-compose`](https://docs.docker.com/compose/install/) (should be auto-installed as part of Docker on mac and windows)

2. Download the current release from this page: https://github.com/samtecspg/articulate/releases/latest

3. Unzip and get a terinal or CMD in the new  directory

4. run `docker-compose up` (`sudo` might be needed)

5. point your web browser at http://localhost:3500 and enjoy Articulate

To explore the API you can go to http://localhost:8000/documentation
