# NC Backend Project News

https://nc-backend-project-news.herokuapp.com/

**This is a project on creating endpoints for a news website and working with a database**

## Getting Started

To be able to have a play with this repo, you'll need Knexjs to interact with your PSQL database, as well as Express for dealing with the server.

### Prerequisites

You will need to install the following minimum versions of software to get going

```
Node v12.9.0
Npm ^6.12.0 (or yarn equivalent)
Express ^4.17.1
Knex ^0.20.1
Postgres ^7.12.1
```

and these will just be for development

```
Chai
Chai-sorted
Mocha
Supertest
```

### Installing

Firtsly, make sure to have Node.js[https://nodejs.org/en/] and npm[https://www.npmjs.com/signup] installed

Get your development env up and running.
You could most likely do

```
npm install

```

and have all your dependencies downloaded, but if you'd like to be thurough, and do them one at a time, you can do the following:

```
npm i express
npm i knex
npm i pg
```

And don't forget the dev dependencies!

```
npm i mocha -D
npm i chai -D
npm i chai-sorted -D
npm i supertest -D
```

Yay! Everything should now be installed and ready to roll.

Because there's a lot going on between Knex, Pg, and the test files (because you should _always_ test your code!), and the commands would be long and unruly, there are some handy scripts you can use!

You can find all the scripts in packag.json, and here's a brief rundown of what they do. Make sure to put **npm run** in front of each script in your terminal to make them work!

Creates the Psql database to hold the tables

```
setup-dbs
```

Makes the tables, moves you along the version control line for your tables, or moves you back along the version control line of your tables

```
migration-make
migration-latest
migration-rollback
```

Adds all the data objects to your table

```
seed
```

And don't forget to test your work with the testing scripts!

```
test-utils
test
```

When you're ready to go to production, there are also some scripts for that

```
seed:prod
migrate-latest:prod
migrate-rollback:prod
```

## Running the Tests

The server is hopefully fully tested, both for the api calls and any utility functions. You can run these tests with the script as mentioned earlier

```
npm test
```

Should you change any funcationality when you're having a play around, make sure to test as it will help you solve/fix problems later.

## Deployment

I've hosted this api server on heroku, with the link above. There's a JSON file included of all the endpoints and their description in this repo, but here are just the endpoints again:

```
GET /api/topics
POST /api/topics

GET /api/users
POST /api/users

GET /api/users/:username

GET /api/articles/:article_id
PATCH /api/articles/:article_id

POST /api/articles/:article_id/comments
GET /api/articles/:article_id/comments?sort_by={anyColumn}&order={asc|desc}&limit={default=10}&p={specificPageRequest}
DELETE /api/articles/:article_id

GET /api/articles?sort_by={anyColumn}&order={asc|desc}&author={anyUsername}&topic={anyTopic}&limit={default=10}&p={specificPageRequest}
POST /api/articles

PATCH /api/comments/:comment_id
DELETE /api/comments/:comment_id

GET /api
```
