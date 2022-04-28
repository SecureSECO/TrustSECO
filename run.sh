#!/bin/bash
if [[ -z "${GITHUB_USERNAME}" ]]; then
  echo "Please provide a GITHUB_USERNAME in your .env file."
  exit 1
fi

if [[ -z "${GITHUB_API_TOKEN}" ]]; then
  echo "Please provide a GITHUB_API_TOKEN in your .env file."
  exit 1
fi

echo 'Starting up CoSy'

set -o allexport; source .env; set +o allexport

docker login ghcr.io -u $GITHUB_USERNAME -p $GITHUB_API_TOKEN
docker-compose up
