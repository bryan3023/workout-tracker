const {Activity} = require("../models")

const ActivityController = {

  getAll(req, res){
    Activity.findAll({
      attributes: [
        'id', 'duration', 'distance', 'reps', 'sets', 'weight',
        ['ExerciseId', 'exerciseId']
      ]
    }).then(data => res.json(data))
  },


  setOne(req, res) {
    Activity.create(req.body).then(({dataValues}) => {
      console.log(data)
      const result = {
        status: "success",
        data: {
          id: dataValues.id,
          duration: dataValues.duration,
          distance: dataValues.distance,
          reps: dataValues.reps,
          sets: dataValues.sets,
          weight: dataValues.weight,
          exerciseId: dataValues.exerciseId,
          workoutId: dataValues.WorkoutId
        }
      }
      console.log(result)
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

module.exports = ActivityController 