const
  router = require('express').Router(),
  {ExerciseController} = require('../controllers')

// -- USE MVC ARCHITECTURE --> HAVE CLEAN ROUTES AND MOVE THE LOGIC TO THE /CONTROLLERS DIRECTORY -- //


// GET  "/""
// Calls controller which will return all activities for a specific workout
router.get("/exercise", ExerciseController.getAll);

// -- ADD ADDITIONAL ROUTES -- //

module.exports = router

