# Backend Assessment

Hello Team! Here is some information about the backend and how to get it running.

## Where to start?
The backend is currently hosted at https://backend-assessment-express.onrender.com/docs/. You can make request to the root at https://backend-assessment-express.onrender.com.

## Local Setup Instructions

Before starting, please run the following command to install all the dependencies:
```bash
yarn
```

### Development Environment
To start the backend in a development environment, use:
```bash
yarn dev
```

### Production Environment
To run the backend without development tools, use:
```bash
yarn start
```

### Running Tests
To execute the tests, simply run:
```bash
yarn test
```

## Why Express & SQLite?

### Express
I chose Express because it is the framework I am most knowledgeable in. Coupled with TypeScript, it provides strict typing and ease in development, making the process smoother and more reliable.

### SQLite
For the database, I selected SQLite and the ORM `TypeORM` for several reasons:
- **TypeORM**: It allows us to stick to schemas and develop without writing raw SQL queries, enhancing development efficiency.
- **SQLite**: We opted for SQLite due to its **ACID** compliance, ensuring data integrity. Additionally, SQLite doesn't require running a physical server, making it a lightweight and convenient choice for our needs.

## Rate Limiting
We have implemented a simple rate limiter in the middleware file. Currently, the rate is set to 15 requests per minute. You can adjust this setting in the `.env` file as needed.

Feel free to reach out if you have any questions or need further assistance!

