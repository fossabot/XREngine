# not slim because we need github depedencies
FROM node:16-buster

RUN apt update
# Create app directory
WORKDIR /app

RUN npm install -g lerna cross-env rimraf --loglevel notice

# to make use of caching, copy only package files and install dependencies
COPY package.json .
COPY packages/analytics/package.json ./packages/analytics/
COPY packages/client/package.json ./packages/client/
COPY packages/client-core/package.json ./packages/client-core/
COPY packages/common/package.json ./packages/common/
COPY packages/editor/package.json ./packages/editor/
COPY packages/engine/package.json ./packages/engine/
COPY packages/gameserver/package.json ./packages/gameserver/
COPY packages/server/package.json ./packages/server/
COPY packages/server-core/package.json ./packages/server-core/
COPY packages/social/package.json ./packages/social/
COPY packages/gallery/package.json ./packages/gallery/
COPY packages/bot/package.json ./packages/bot/
COPY packages/realitypacks/package.json ./packages/realitypacks/

#RUN  npm ci --verbose  # we should make lockfile or shrinkwrap then use npm ci for predicatble builds
RUN npm install --production=false --loglevel notice --legacy-peer-deps

COPY . .

# copy then compile the code

RUN npm run build-docker

ENV APP_ENV=production

CMD ["scripts/start-server.sh"]
