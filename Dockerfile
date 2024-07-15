# This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
# If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

FROM node:16.13-alpine AS build

WORKDIR /flowkit-ui

COPY package.json package.json

COPY . .

RUN apk add git

RUN yarn install \
    && yarn upgrade \
    && yarn build

FROM nginx:alpine

COPY container/nginx.conf /etc/nginx/conf.d/configfile.template

WORKDIR /usr/share/nginx/html

RUN rm -rf *

COPY --from=build /flowkit-ui/build .

ENV PORT 8080
ENV HOST 0.0.0.0
ENV PUBLIC_URL .
ENV REACT_APP_MAINTAINENCE_MODE ""
EXPOSE 8080

# Substitute $PORT variable in config file with the one passed via "docker run"
CMD sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf && envsubst < env.js > env.js.tmp && mv env.js.tmp env.js && nginx -g 'daemon off;'"
