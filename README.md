# F1 Calendar Scraper

## What it is
This small node.js solution effectively scrapes the F1 calendar from [Formula One](https://www.formula1.com/) using a mixture of `Axios` and `Puppeteer`. A third party HTML parser called `Cheerio` is also in use.

## Getting Started
You will want the following installed before starting:
- NodeJS installed
- Docker installed (for ease of use)
- A database viewer, I use [PgAdmin](https://www.pgadmin.org/)

1. Create a .env file in the root of the directory.
2. Add the following line into it: `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/calendar-db?schema=public"`. This is used by `Prisma` as a means of connecting to our Postgres instance.
3. Run `npm install` in the root directory, this will pull down all necessary dependencies from the `package.json` file.
4. Run `npm run db:local:start`. This will start a new docker container with Postgres installed and will run the database migrations from `./prisma/migrations` against the database docker container. You should be able to see the database and its tables if you connect to localhost using your chosen database viewer after this step.
6. Run `npm run start:dev`. This will kick off the scraping process.

## Database ERD
The image below illustrates the most up-to-date view of the database.

![](./prisma/calendar-diagram.svg)