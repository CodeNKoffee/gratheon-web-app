# gratheon / web-app

Single page app for beehive management

![Screenshot_20221215_145008](https://user-images.githubusercontent.com/445122/208070865-e9c486bb-84ed-4205-a269-70693016d808.png)

## Architecture

```mermaid
flowchart LR
    web-app("<a href='https://github.com/Gratheon/web-app'>web-app</a>\n:8080") --> graphql-router
    web-app --"subscribe to events"--> event-stream-filter("<a href='https://github.com/Gratheon/event-stream-filter'>event-stream-filter</a>\n:8300\n:8350") --> redis

    graphql-router("<a href='https://github.com/Gratheon/graphql-router'>graphql-router</a>\n :6100") --> swarm-api("<a href='https://github.com/Gratheon/swarm-api'>swarm-api</a>\n:60002") --> mysql[(mysql\n:60003)]
    graphql-router --> swarm-api --> redis[("<a href='https://github.com/Gratheon/redis'>redis pub-sub</a>\n:6379")]

    graphql-router --> image-splitter("<a href='https://github.com/Gratheon/image-splitter'>image-splitter</a>\n:8800") --> mysql
    graphql-router --> image-splitter --> aws-s3
    graphql-router --> user-cycle("<a href='https://github.com/Gratheon/user-cycle'>user-cycle</a>\n:4000") --> mysql
    graphql-router --> user-cycle --> stripe
    graphql-router --> plantnet("<a href='https://github.com/Gratheon/plantnet'>plantnet</a>\n:8090") --> mysql
    graphql-router --> graphql-schema-registry("graphql-schema-registry\n:6001")
    graphql-router --> weather("<a href='https://github.com/Gratheon/weather'>weather</a>\n:8070")
```

## URLs

| env   | url                       |
| ----- | ------------------------- |
| local | http://0.0.0.0:8080/      |
| live  | https://app.gratheon.com/ |

### Tech stack
- typescript
- preact (builder)
- react
- react-router
- urql
- dexie + index-db

## Development

```
npm run develop
```
