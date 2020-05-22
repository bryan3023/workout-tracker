const {Workout, Activity} = require("../models")

const WorkoutController = {

  getAll(req, res) {
    Workout.findAll({include: [Activity]}).then(data =>  res.json(data))
  },

  create(req, res) {
    console.log(req.body)
    Workout.create(req.body).then(data => res.json(data))
  }
}

module.exports = WorkoutController 