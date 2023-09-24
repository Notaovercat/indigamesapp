FROM node:16-alpine as builder

WORKDIR /app

RUN apk --no-cache add openssh g++ make python3 git

RUN npm i -g pnpm
COPY package.json /app/

RUN pnpm install 

ADD . /app

RUN npm run build

FROM node:16-alpine


WORKDIR /app

COPY --from=builder /app  /app

ENV HOST 0.0.0.0
EXPOSE 3000

# run the build project with node
ENTRYPOINT ["node", ".output/server/index.mjs"]