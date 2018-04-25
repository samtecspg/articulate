---
title: Cloud Installation
layout: default
order: 1
---

# Cloud Installation

You may want to try running Articulate on a cloud based VM. I do it all the time. There are lot's of considerations like installing docker, securing the VM, etc. If you're running in the cloud I am going to assume you can get that setup. However there are two specific changes that you need to make to the Articulate `docker-compose.yml` to make everything work.

#### Compose File Changes

* Under the **api** service add a new environment variable: `- SWAGGER_HOST=VM_PUBLIC_IP` make sure to replace *VM_PUBLIC_IP* with the public IP of your VM.  Also add `DOCKER_HOST=VM_PUBLIC_IP` make sure to replace *VM_PUBLIC_IP* with the public IP of your VM.
* Under the **ui** service change the `API_URL` to be equal to `http://VM_PUBLIC_IP:8000` make sure to replace *VM_PUBLIC_IP* with the public IP of your VM.

That is all that is required to run Articulate on a cloud VM. If you have any trouble with it reach out to us on our [Gitter channel](https://gitter.im/samtecspg/articulate) or [create an issue](https://github.com/samtecspg/articulate/issues/new).

#### Starting The Container

**If installing on a public host or on a docker host that uses a 192.168, etc type IP please ensure you create a .env file and put the below values in it so the application will work as expected.  You can see the .env.example.docker at the root directory for an example**

`DOCKER_HOST=ip_address_here`

`SWAGGER_HOST=same_ip_address`

`API_URL=http://same_ip_address:8000`

 1. Make sure you have Docker and `docker-compose` installed:

    * [Docker](https://docs.docker.com/engine/installation/) (If faced with any choices, get the Community Edition ("CE"))
    
    * [`docker-compose`](https://docs.docker.com/compose/install/) (should be auto-installed as part of Docker on mac and windows)


 2. Download the current release zip (articulate-vX.X.X.zip): https://github.com/samtecspg/articulate/releases/latest

 3. Unzip and get a terminal or CMD in the release directory

 4. run `docker-compose up -d` (`sudo` might be needed)

 5. point your web browser at  http://localhost:3000 and enjoy Articulate
