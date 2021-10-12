#!/bin/bash
set -e
set -x

CURRENT_TIME=`date +"%d-%m-%yT%T"`
touch ./builder-started.txt
sh ./scripts/setup_helm.sh
sh ./scripts/setup_aws.sh $AWS_ACCESS_KEY $AWS_SECRET $AWS_REGION $CLUSTER_NAME
npm run install-reality-packs
sh ./scripts/build_docker.sh $RELEASE_NAME $DOCKER_LABEL
npm install -g cli aws-sdk
sh ./scripts/publish_ecr.sh $RELEASE_NAME $TAG__$CURRENT_TIME $DOCKER_LABEL $AWS_REGION
sh ./scripts/deploy.sh $RELEASE_NAME $TAG__$CURRENT_TIME
sh ./scripts/publish_dockerhub.sh $TAG__$CURRENT_TIME $DOCKER_LABEL
sleep infinity
