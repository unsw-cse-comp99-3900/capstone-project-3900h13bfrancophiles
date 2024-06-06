# H13B Francophiles COMP3900 Project
This is the project.

## Local Setup
You might be able to run everything with:
```
docker compose up --build -d
```

### Postgres
If you haven't already, install Postgres:
```
brew install postgresql@15
brew services start postgresql
```
Create and initialise a database for the project:
```
createdb 3900
psql 3900 -f postgres/init.sql
```
For now any changes to the database schema will mean you need to edit `init.sql`, drop the database, recreate it, and reinitialise it with the updated `init.sql`.

### Backend
The following instructions assume you have yarn installed and are working in the `backend` directory. 

To install necessary dependencies:
```
yarn install
yarn prisma
```
The `yarn prisma` above generates a Prisma schema from the database, so will need to be re-run whenever the database schema changes.

You will need to configure the `.env` file, there is an example file provided. The required environment variables are:
- `PORT` - the port to run the backend on
- `DATABASE_URL` - connection string for the database, in the format `postgresql://$USER:$PASSWORD@localhost:5432/$DATABASE` where `$USER` and `$PASSWORD` are (by default) your username on your device, and `$DATABASE` is whatever you named the database when setting it up (e.g. `3900`)

To run the backend in development mode (automatically restarts whenever code changes are made):
```
yarn dev
```
If successful, you should see the message `"Server is running at [URL]"`.

### Frontend
The following instructions assume you have yarn installed and are working in the `frontend` directory.

To install necessary dependencies:
```
yarn install
```

You will need to configure the `.env` file, there is an example file provided. The required environment variables are:
- `NEXT_PUBLIC_BACKEND_URL` - the backend URL, whatever URL is printed when the backend starts

To run the frontend in development mode (automatically restarts whenever code changes are made):
```
yarn dev
```
