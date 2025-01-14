#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

VERSION=$(grep '"version"' "$SCRIPT_DIR/../package.json" | awk -F '"' '{print $4}')

if [ -z "$VERSION" ]; then
    echo "can't extract version"
    exit 1
fi

echo "version name : $VERSION"

docker build --platform linux/amd64 -t docker address $SCRIPT_DIR/../.

if [ $? -eq 0 ]; then
    docker push docker address
else
    echo "docker image build failed"
    exit 1
fi