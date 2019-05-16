# Basic Installation

The easiest way to get started with Articulate is to use our included `docker-compose` file. Articulate relies on several services besides it's own UI and API. These all get started when you use the provided compose.

<Note type="warning">

A few warnings before we get started:

- **Memory Requirement** - Loading and Training these language models dictates a certain amount of RAM. For experimenting with smaller agents 3Gb may be sufficient, but for larger agents much more RAM may be required. If training takes more than a few minutes for small agents or more than half an hour for large agents, it is a good indicator that you are running low on memory.
- **Windows Shared Drives** - On Windows, make sure you have shared the drive with Docker so that it can mount directories inside of the container.
- **Docker Toolbox** - The below instructions work best on Linux or when using *Docker for Windows* or *Docker for Mac*.

</Note>

## Setup

1. **Installing Prerequisites** - Make sure you have Docker, Docker Compose, and Git installed:

   * [Docker](https://docs.docker.com/engine/installation/) (If faced with any choices, get the Community Edition ("CE"))
   * [Docker Compose](https://docs.docker.com/compose/install/) (should be auto-installed as part of Docker on mac and windows)
   * Git (installed by default on mac and most linux varieties. To install on windows get it [here](https://git-for-windows.github.io))

2. **Downloading** - Download the current release from this page: [https://github.com/samtecspg/articulate/releases/latest](https://github.com/samtecspg/articulate/releases/latest)

3. **Extracting** - Unzip and get a terminal or command prompt in the new  directory

Once you've got everything extracted you're ready to start Articulate. The below instructions cover running locally and in the cloud:

## Get it Running

Running locally or in the cloud is as simple as running a single command:

```
docker-compose up
```

<Note type="tip">

`sudo` may be required

</Note>

After Docker downloads the images and starts them Articulate should be available at [http://localhost:8080](http://localhost:8080) and the API documentation should be available at [http://localhost:7500/documentation](http://localhost:7500/documentation)
