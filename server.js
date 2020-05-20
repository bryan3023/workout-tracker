const
  express = require("express"),
  path = require("path"),
  db = require("./models")

const
  api_routes = require("./routes/api_routes"),
  about_routes = require("./routes/html_routes")

const
  app = express(),
  PORT = process.env.PORT || 8080


app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(express.static("public"))

// ==== ** OPTIONAL ** ===== //
// -- IF YOU WANT TO USE HANDLEBARS TO SERVE UP YOUR HTML FILES, INCLUDE MIDDLEWARE SETUP BELOW -- //

// ^^ DON'T FORGET TO ADD THE /views AND ANY LAYOUT FILES REQUIRED FOR HANDLEBARS TO SERVE UP HTML FILES ^^ //
// ========================= //


// -- ROUTES -- //

// --> STUDENTS: DEFINE ROUTES TO HANDLE WORKOUT AND EXERCISE API CALLS -- //




// ================================== // 
// -- Activity Syntax -> Passing App INSTANCE to Route -- //
require("./routes/html_routes")(app)


// -- Example ROUTES using EXPRESS ROUTER (https://expressjs.com/en/guide/routing.html) -- //

// -- Use express router to register routes as middleware -- //
app.use('/api/activity', api_routes);

// ======= ALTERNATE SYNTAX FOR /about ROUTE USING EXPRESS ROUTER ==== //
// app.use('/about', about_routes);  // <-- uncomment to use, update 


// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log(`App running on port ${PORT}!`)
  })
})

