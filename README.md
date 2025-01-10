# Backend Assessment
Hello Team! Here is some information about the backend and how to get it running.

Simply run `yarn dev` to get it started on a development environment!

And run `yarn start` to get it running without development tools.

To run tests, simply run `yarn test` to get the tests running!

### Why Express & SQLite?
I went with express because it is what I am most knowledgeable in, along with typescript for strict typing and ease in development.
For the database I went with an ORM called `typeorm` which made it better for us to stick to schemas and develop without writing SQL Queries. And I chose SQL for it's **ACID** compliance, we use SQLite because we do not need ot run a physical server.
