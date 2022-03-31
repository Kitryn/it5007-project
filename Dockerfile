FROM node:16-alpine AS app

ENV NODE_ENV=production
ENV WORKDIR = /usr/src/app

RUN mkdir -p ${WORKDIR}
WORKDIR ${WORKDIR}

COPY . .
RUN yarn install --frozen-lockfile

RUN echo "Building client" \
    && yarn client:build \
    && echo "Build artifacts ready for extraction"

RUN echo "Building server" \
    && yarn server:build \
    && echo "Server built"

RUN cp -r ./packages/client/build ./packages/server/build

EXPOSE 3000

# CMD ["yarn", "server:start"]
CMD ["yarn", "client:start"]
