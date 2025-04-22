<h1> stasbook </h1>
## Description

## Project setup

# expamle .env

<a href="https://github.com/stasiska/stasbookrepo/blob/main/nestjsmicroservice.png"><strong>Explore the docs »</strong></a>

# design

![System Design](https://github.com/stasiska/stasbookrepo/blob/main/nestjsmicroservice.png?raw=true)


## Tech Stack

- **Framework**: Nodejs, Nestjs. 
- **DB**: Postgres, Redis(Cache, Session).
- **Transport Protocols**: Grpc, protobuff, RabbitMq.
- **ORM**: DRIZZLE, PRISMA.
- **Logger**: Pino.
- **Metrics**: Grafana, Prometeus.
- **Object Storage**: S3.
- **Auth**: Session, oauth2, mail(mailhog).
- **Containerization**: Docker, docker-compose.
## Setup project

# ENV

[api-gateway](https://github.com/stasiska/stasbookrepo/tree/main/apps/api-gateway)

[auth-service](https://github.com/stasiska/stasbookrepo/tree/main/apps/auth-service)

[post-service](https://github.com/stasiska/stasbookrepo/tree/main/apps/post-service)

[social-service](https://github.com/stasiska/stasbookrepo/tree/main/apps/social-service)

[notification-service](https://github.com/stasiska/stasbookrepo/tree/main/apps/notification-service)

```bash
$ npm install
```

## Build lib

cd ./ cacheRedis 

```bash
$ npm run build
```

cd ./ grpc 

```bash
$ npm run build
```

cd ./ logger 

```bash
$ npm run build
```

cd ./ queue 

```bash
$ npm run build
```

cd ./ s3 

```bash
$ npm run build
```

cd ./ shared 

```bash
$ npm run build
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```

## Stay in touch

- Author - stasika

