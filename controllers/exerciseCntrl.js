// This is an example of a Controller. Note how it requires in the model(s) it needs.

const { Exercise } = require("../models")

const ExerciseCntrl = {
  // This is called (when needed) from the route page when a 
  // listing of all exercises is needed
  getAll(req, res){

    // -- YOU WILL UPDATE WHAT THE "RESPONSE OBJECT" RETURNS -- //
    return res.json({ searching: "Finding Exercises ..."})

    // -- EXAMPLE SEQUELIZE DB QUERY -- //
    // Exercise.find({}).then(data => {
    //   res.json(data)
    // });
  }
}

module.exports = ExerciseCntrl