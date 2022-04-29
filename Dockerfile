FROM node:16-alpine AS app

ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}
ENV WORKDIR=/app

RUN mkdir -p ${WORKDIR}
WORKDIR ${WORKDIR}

COPY . .
RUN if [ "${NODE_ENV}" = "production" ]; \
    then yarn install --frozen-lockfile; \
    else yarn install; \
    fi

RUN echo "Building server" \
    && yarn server:build \
    && echo "Server built"

EXPOSE 3000

CMD ["yarn", "server:start"]
