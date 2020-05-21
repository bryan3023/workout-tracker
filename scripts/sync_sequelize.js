const db = require("../models")

db.sequelize.sync().then(() => {
  return console.log("Database synced!")
})