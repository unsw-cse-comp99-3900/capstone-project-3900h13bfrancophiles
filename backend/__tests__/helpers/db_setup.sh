# Create the test db
dropdb 3900-test
createdb 3900-test

# Initialise with global init and test data
psql 3900-test -f ../postgres/01_init.sql
psql 3900-test -f __tests__/helpers/test.init.sql
