# DEVELOPMENT
FROM node:alpine as development

ENV NODE_ENV development

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm i -g pnpm

RUN pnpm install

COPY . .

RUN npx prisma generate
RUN pnpm run build

# BUILD
FROM node:alpine as build
ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

COPY --from=development /usr/src/app/node_modules ./node_modules

COPY . .

RUN npm i -g pnpm
RUN pnpm run build

RUN pnpm install --prod

# PRODUCTION
FROM node:alpine as production

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]

