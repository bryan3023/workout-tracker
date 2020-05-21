const
  { getMySqlRootCredentials, runMySqlScript} = require('./database_helper')

const
  env = process.env.NODE_ENV || 'development',
  config = require(__dirname + '/../config/config.json')[env],
  database = process.argv[2] || config.database 


getMySqlRootCredentials().then(credentials => {
  runMySqlScript('remove.sql', credentials)
})
