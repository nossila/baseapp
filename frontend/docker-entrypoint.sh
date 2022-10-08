#!/bin/bash -xe

export DANGEROUSLY_DISABLE_HOST_CHECK=true
yarn
yarn relay

# dev
yarn dev


# export NODE_ENV=production
# yarn build
# cp -r build/static/* /static/
# node server.js
