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
psql 3900 -f postgres/01_init.sql
psql 3900 -f postgres/02_data.sql
```
For now any changes to the database schema will mean you need to edit `01_init.sql`, drop the database, recreate it, and reinitialise it with the updated `01_init.sql`. Commands for this:
```
./postgres/resetdb.sh
```

[For a WSL installation](https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-database):
```
sudo apt update
sudo apt install postgresql postgresql-contrib
```
Set a password for postgres `sudo passwd postgres`, then `sudo service postgresql start` and `sudo -u postgres psql` to connect to the psql shell.


### Backend
The following instructions assume you have yarn installed and are working in the `backend` directory.

To install necessary dependencies:
```
yarn install
yarn drizzle
```
The `yarn drizzle` above generates a Drizzle schema from the database, so will need to be re-run whenever the database schema changes.

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
