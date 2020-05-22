const {Workout, Activity} = require("../models")

const WorkoutController = {

  getAll(req, res) {
    Workout.findAll({
      attributes: ['id', 'name', 'day'],
      include: [Activity]
    }).then(data => {
      res.json(data)
    })
  },

  create(req, res) {
    console.log(req.body)
    Workout.create(req.body)
      .then(data => {
        const result = {
          status: "success",
          data: {
            id: data.dataValues.id,
            name: data.dataValues.name,
            day: data.dataValues.day
          }
        }
        res.json(result)
      })
      .catch(error => {
        const result = {
          status: "failure",
          data: error.message
        }
        res.json(result)
      })
  }
}

module.exports = WorkoutController 