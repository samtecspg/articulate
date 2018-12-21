#!/bin/bash
# Copied from https://github.com/docker-library/healthcheck/tree/master/elasticsearch/docker-healthcheck
# Usage: docker-healthcheck  # by default, waits for "green"
#        docker-healthcheck yellow # to wait for "yellow" instead

target='green'
if [ ! -z "$1" ]; then
  target="$1"
fi

set -eo pipefail

# Use -i instead of --ip-address in case hostname was just a symlink to busybox
# The busybox version of hostname supports -i and not --ip-address
# Both busybox/hostname and the GNU hostname support -i
# References:
# https://busybox.net/downloads/BusyBox.html#hostname
# https://linux.die.net/man/1/hostname
# http://manpages.ubuntu.com/manpages/precise/man1/hostname.1.html
host="$(hostname -i || echo '127.0.0.1')" 

# TODO with xpack, the below curl will fail with "unauthorized" error if xpack is enabled 
if health="$(curl -fsSL "http://$host:9200/_cat/health?h=status")"; then
  health="$(echo "$health" | sed -r 's/^[[:space:]]+|[[:space:]]+$//g')" # trim whitespace (otherwise we'll have "green ")

  # 1st check if health is at its best
  if [ "$health" = "green" ]; then
    exit 0
  fi

  # next check if the minimum requirement is yellow
  if [ "$health" = "$target" ]; then
    exit 0
  fi

  echo >&2 "unexpected health status: $health"
fi

exit 1