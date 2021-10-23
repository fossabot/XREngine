#!/bin/bash
set -e
set -x

STAGE=$1
TAG=$2
LABEL=$3
REGION=$4

aws ecr get-login-password --region $REGION | docker login -u AWS --password-stdin $ECR_URL
node ./scripts/prune_ecr_images.js --repoName $REPO_NAME --region $REGION

docker tag $LABEL $ECR_URL/$REPO_NAME:$TAG
docker tag $LABEL $ECR_URL/$REPO_NAME:latest_$STAGE
docker push $ECR_URL/$REPO_NAME:$TAG
docker push $ECR_URL/$REPO_NAME:latest_$STAGE
