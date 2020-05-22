const {Exercise} = require("../models")

const ExerciseController = {

  getAll(req, res){
    Exercise.findAll({
      atrributes: ['id', 'name', 'type']
    }).then(data => res.json(data))
  }

}

module.exports = ExerciseController 