---
title: Advanced Installation
layout: default
order: 1
---

# Advanced Installation

This is how you install stuff the hard way. **We're still working on this section.**

### Installing with docker into an existing ES cluster
If you're only using Kibana with the plugins that Elastic provides by default then it is mostly straight forward to use our custom Kibana builds with your existing cluster, but you will need to make a few changes to the compose file that brings everything up.

The below changes assume that you want to run all of the components of conveyor on a single server.

### Installing without docker
If you use other plugins or simply don't want to use docker then you will need to install the plugin manually into Kibana. Elastic provides some great docs on how to do this, but there are a few conveyor specific changes you will need to make to your kibana configuration file. Here are the steps to take for this type of install:


