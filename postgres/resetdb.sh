dropdb 3900
createdb 3900
psql 3900 -f 01_init.sql
psql 3900 -f 02_data.sql
psql 3900 -f 03_dev_data.sql
