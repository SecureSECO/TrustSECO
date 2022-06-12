#!/bin/bash
if [ ! -x "$(command -v docker)" ]; then
    echo "Please make sure docker is installed."
    exit 0
fi

if [ ! -x "$(command -v docker-compose)" ]; then
    echo "Please make sure docker-compose is installed."
    exit 0
fi

echo 'Starting up TrustSECO'

echo "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" | docker login ghcr.io -u "TrustSECO-Machine-User" --password-stdin
docker-compose up