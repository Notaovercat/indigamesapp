# DEVELOPMENT
FROM node:alpine as development

ENV NODE_ENV development

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm i -g pnpm

RUN pnpm install --frozen-lockfile

COPY . .

RUN npx prisma generate
RUN pnpm run build

# PRODUCTION
FROM node:alpine as production

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm i -g pnpm
RUN pnpm i --prod

COPY  --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main.js"]