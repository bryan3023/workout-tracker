const
  {Activity} = require("../models"),
  {removeSequelizeColumns} = require('../lib')

const ActivityController = {

  getAll(req, res){
    Activity.findAll({
      attributes: [
        'id', 'duration', 'distance', 'reps', 'sets', 'weight', 'exerciseId'
      ]
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


  setOne(req, res) {
    Activity.create(req.body).then(({dataValues}) => {
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

module.exports = ActivityController 