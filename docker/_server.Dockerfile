FROM node:18.17.1 AS build
WORKDIR /opt/app

RUN ["yarn", "set", "version", "berry"]
COPY [".yarnrc.yml", "./"]
COPY [".yarn", ".yarn/"]

COPY ["package.json", "yarn.lock", "./"]
RUN ["yarn", "install"]

RUN ["yarn", "fix-native-modules"]

COPY ["tsconfig.build.json", "tsconfig.json", "./"]
COPY ["nest-cli.json", "./"]
COPY ["src/", "./src/"]
RUN ["yarn", "build"]

FROM --platform=linux/x86_64 node:18.17.1
WORKDIR /opt/app

COPY --from=build /opt/app/.yarnrc.yml ./
COPY --from=build /opt/app/.yarn/ ./.yarn/
RUN ["yarn", "set", "version", "berry"]

COPY ["package.json", "yarn.lock", "./"]
RUN yarn install && yarn fix-native-modules

COPY --from=build ["/opt/app/dist", "./dist"]

ARG ENV
ENV ENV=${ENV}

COPY [".env", "./.env"]

ENTRYPOINT ["yarn", "node", "dist/main"]
EXPOSE 4000/tcp
