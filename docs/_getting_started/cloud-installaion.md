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
