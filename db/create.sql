--
--  Create a database and account for working with the database in development.
--


DROP DATABASE IF EXISTS sequelize_fitness_DB;
CREATE DATABASE sequelize_fitness_DB;


DROP USER IF EXISTS 'bryan3023.sequelize_fitness'@'localhost';

CREATE
  USER 'bryan3023.sequelize_fitness'@'localhost'
  IDENTIFIED BY 'od$VP^rwg!ek0!V1O2^%'
;

GRANT
  ALL
ON
  sequelize_fitness_DB . *
TO
  'bryan3023.sequelize_fitness'@'localhost'
;