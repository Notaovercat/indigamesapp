[![My Skills](https://skillicons.dev/icons?i=ts,nodejs,nest,nuxt,prisma,postgres,redis,socketio)](https://skillicons.dev)
# IndiegamesApp

[TOC]

**About**
This full-stack web application built with Node.js, Nuxt.js, Nest.js, Prisma, PostgreSQL, and Redis. It allows users to upload their games, manage them, and engage with other users through comments using Socket.io. 

##Getting started
###Prerequisites
Before you begin, make sure you have the following installed on your system:

- Node.js
- PostgreSQL
- Redis
- pnpm

###Installation
1. Clone the repository:
```bash 
https://github.com/Notaovercat/indigamesapp.git
```

2. Navigate to the project directory
```bash 
cd indigamesapp
```
3. Install dependencies
```bash 
pnpm i
```

##Configuration
Make sure to configure the following environment variables in backend .env file:
```env
DATABASE_URL=postgres://postgres:postgres@your-postgres-host:5432/postgres
REDIS_HOST=your-redis-host
REDIS_PORT=your-redis-port

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=exparation_time

# APP
APP_PORT=your_app_port

# CLIENT
CLIENT_API=your_client_api
```

Configure the following environment variables in frontend .env file:
```env
API_URL=your_api_url
```

##Startig
###Usage
For starting dev server run this following commands:
```bash
pnpm run prisma:dev
pnpm run dev
```
For starting in production mode:
```bash
pnpm run prisma:deploy
pnpm run build
pnpm run start
```