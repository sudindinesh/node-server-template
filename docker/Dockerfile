FROM node:16-alpine as base

RUN addgroup --gid 1001 server \
    && adduser --ingroup "server" --home /home/server --uid 1001 --system --disabled-password server \
    && mkdir -p /usr/src/app && chown server:server /usr/src/app

FROM base as dependencies

USER server

WORKDIR /usr/src/app

COPY --chown=server ./server/package.json ./server/package-lock.json ./

RUN npm i

FROM base as build

USER server

WORKDIR /usr/src/app

COPY --chown=server ./server/. .

COPY --from=dependencies --chown=server /usr/src/app/node_modules ./node_modules

RUN npm run build

EXPOSE 3000

CMD [ "node", "server.js" ]

FROM base as production_install

USER server

WORKDIR /usr/src/app

COPY --chown=server ./server/package.json ./server/package-lock.json ./

RUN npm i --production

FROM base as app

USER server

WORKDIR /usr/src/app

COPY --chown=server ./server/package.json ./server/package-lock.json ./server/tsconfig.json ./
COPY --from=build --chown=server /usr/src/app/dist ./dist

COPY --from=production_install --chown=server /usr/src/app/node_modules ./node_modules

EXPOSE 3000

CMD [ "npm", "run", "start" ]
