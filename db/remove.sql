--
--  Remove database and user account from local/development MySQL instances.
--


DROP DATABASE IF EXISTS sequelize_fitness_DB;
DROP USER IF EXISTS 'bryan3023.sequelize_fitness'@'localhost';
