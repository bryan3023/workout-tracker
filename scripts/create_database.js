const
  { getMySqlRootPassword, runMySqlScript} = require('./database_helper')

const
  env = process.env.NODE_ENV || 'development',
  config = require(__dirname + '/../config/config.json')[env],
  database = process.argv[2] || config.database 


getMySqlRootPassword().then(password => {
  runMySqlScript('create.sql', password)
  runMySqlScript('schema.sql', password, database)
  runMySqlScript('seed.sql', password, database)
})
