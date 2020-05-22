const {Exercise} = require("../models")

const ExerciseController = {

  getAll(req, res){
    Exercise.findAll({}).then(data => res.json(data))
  }

}

module.exports = ExerciseController 