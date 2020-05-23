const
  {Workout, Activity} = require("../models"),
  {removeSequelizeColumns} = require('../lib')

const WorkoutController = {


  getAll(req, res) {
    Workout.findAll({
      attributes: {exclude: ['createdAt', 'updatedAt']},
      include: [{
        model: Activity,
        as: 'activities',
        attributes: {exclude: ['createdAt', 'updatedAt']}
      }]
    }).then(response => {
      const result = {
        status: "success",
        data: response.map(r => r.dataValues)
      }
      res.json(result)
    }).catch(error => {
      const result = {
        status: "failure",
        data: error.message
      }
      res.json(result)
    })
  },


  create(req, res) {
    console.log(req.body)
    Workout.create(req.body)
      .then(({dataValues}) => {
        const result = {
          status: "success",
          data: dataValues
        }
        removeSequelizeColumns(result.data)
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