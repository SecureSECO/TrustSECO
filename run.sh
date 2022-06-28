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

pat=$(echo 'Z2hwX0JSR3UxQjR1eWlKa1RLVFk4ZjI2Q0JZejZHZDduUTJQV3JDOAo=' | base64 -d)
echo $pat | docker login ghcr.io -u "TrustSECO-Machine-User" --password-stdin
docker-compose up --build

# This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
# © Copyright Utrecht University (Department of Information and Computing Sciences)
