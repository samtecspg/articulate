#!/bin/bash
# wait-for-es.sh

set -e

esHost="$1"
shift
apiStartCmd="$@"

yellow=yellow
green=green

{ #try
  status=$(curl -s -XGET http://$esHost/_cluster/health | python -c "exec(\"import json,sys\ntry:\n\tobj=json.load(sys.stdin)\n\tprint obj['status']\nexcept:\n\tprint 'unknown'\")")
} || { #catch
  status=unknown
  echo "Cannot connect to ElasticSearch - waiting"
} 

until [ $status == $yellow ] || [ $status == $green ]; do
  >&2 echo "ElasticSearch status is $status - waiting"
  { #try
    sleep 10
    status=$(curl -s -XGET http://$esHost/_cluster/health | python -c "exec(\"import json,sys\ntry:\n\tobj=json.load(sys.stdin)\n\tprint obj['status']\nexcept:\n\tprint 'unknown'\")")
  } || { #catch
    status=unknown
    echo "Cannot connect to ElasticSearch - waiting"
    sleep 20
  } 
done

>&2 echo "ElasticSearch is up - starting API"

exec $apiStartCmd
