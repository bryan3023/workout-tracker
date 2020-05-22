const {Activity} = require("../models")

const ActivityController = {

  getAll(req, res){
    Activity.findAll({}).then(data => res.json(data))
  },


  setOne(req, res) {
    console.log(req.body)
    console.log(req.params)
    Activity.create(req.body).then(data =>  res.json(data))
  }

}

module.exports = ActivityController 