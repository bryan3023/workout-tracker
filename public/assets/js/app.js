/*
  
 */

$(document).ready(() => {

  function start() {
    getExercises()
    getWorkouts()
  }



  const Exercises = {
    exercises: [],

    getAll() {
      return this.exercises
    },

    setAll(exercises) {
      this.exercises = exercises
    },

    getName(id) {
      return this.exercises
        .filter(e => e.id === parseInt(id))
        .map(e => e.name)[0]
    }
  }


  const Workouts = {
    workouts: [],
    current: null,

    getAll() {
      return this.workouts
    },

    get(id) {
      return this.workouts.filter(w => w.id === id)[0]
    },

    setAll(workouts) {
      workouts.forEach(w => w.day = getDayString(w.day))
      this.workouts = workouts
    },

    getCurrent() {
      return this.get(this.current)
    },

    getCurrentId() {
      return this.current
    },

    setCurrentId(current) {
      this.current = parseInt(current)
    },

    add(workout) {
      workout.activities = []
      workout.day = getDayString(workout.day)
      console.log(workout)

      this.workouts.push(workout)
    },

    getCurrentActivities() {
      return this.getCurrent().activities
    },

    addCurrentActivity(activity) {
      this.getCurrentActivities().push(activity)
    }
  }


  

  const
    $exerciseDropDown = $("select[name='exerciseId']"),
    $workoutList = $("#workouts-list ul"),
    $activityList = $("#activities-list ul"),
    $addWorkoutForm = $("form#add-workout"),
    $addActivityForm = $("form#add-activity")


// --- DOM Population ---

  /*
    Render the list of workout items, highlighting the selected one.
   */
  function renderWorkoutList() {
    $workoutList.empty()

    Workouts.getAll().forEach(workout => {
      const $workoutItem = getRenderedWorkoutItem(workout)

      if (Workouts.getCurrentId() === workout.id) {
        $workoutItem.addClass("selected")
      }
      $workoutList.append($workoutItem)
    })
  }


  /*
    Render an individual item in the workout list.
   */
  function getRenderedWorkoutItem(item) {
    return $("<li>")
      .addClass("workout-item")
      .attr("data-workout-id", item.id)
      .html(`<span>${item.day}</span> ${item.name}`)
  }


  // STUDENTS: Populate activity data for the selected workout
  function renderActivityList() {
    $activityList.empty()

    Workouts.getCurrentActivities().forEach(activity => {
      const
        exerciseName = Exercises.getName(activity.exerciseId),
        activityDescription = `<span>${exerciseName}</span>`,
        idValues = ['id', 'workoutId', 'exerciseId'],
        exerciseTargets = []

      removeEmptyProperties(activity)
      for (const property in activity) {
        if (!idValues.includes(property)) {
          exerciseTargets.push(getActivityTargetString(activity, property))
        }
      }

      const $activityItem = getRenderedActivityItem(activity)
        .html(activityDescription + exerciseTargets.join(", "))

      $activityList.append($activityItem)
    })
    renderActivitiesHeader()
    $("div.activity-pane").show()
  }



  /*
    If an activity's target has a value, render HTML for that target.
   */
  function getActivityTargetString(object, field) {
    return field in object && object[field] ?
      `<strong>${field}:</strong> ${object[field]}` :
      null
  }

  function getRenderedActivityItem(item) {
    return $("<li>")
      .addClass("activity-item")
      .attr("data-activity-id", item.id)
  }

  function renderActivitiesHeader() {
    const workoutName = Workouts.getCurrent().name
    $("#activity-header").text(`${workoutName} - Activities`)
  }


  /*
    Fill the drop-down list with exercises to choose from.
   */
  function renderExerciseDropDownList() {
    Exercises.getAll().forEach(exercise => {
      const $exerciseOption = $("<option>")
        .val(exercise.id)
        .text(exercise.name)
      $exerciseDropDown.append($exerciseOption)
    })    
  }


  /*
    Breifly show an alert when the user fails to provide needed input.
   */
  function showAlert(message) {
    const $alertBox = $(".error-alert")
    $alertBox.text(message)
    $alertBox.show()
    setTimeout(() => $alertBox.hide(), 2000)
  }


// --- Event handlers ---
  
  /*
    When an item in the workout list is clicked, show it on the activity pane.
   */
  $workoutList.on("click", ".workout-item", function(event) {
    event.preventDefault()

    $workoutList.children().removeClass("selected")
    $(this).addClass("selected")

    const id = $(this).attr("data-workout-id")
    Workouts.setCurrentId(id)

    renderActivityList()
  })


  /*
    Create a new workout when the user submits a name.
   */
  $addWorkoutForm.on("submit", function(event) {
    event.preventDefault();

    const form = $(this)
    form.find("[name='day']").val(new Date())
    trimFormInputs(form)

    saveWorkout(form.serialize())
    form[0].reset()
  })


  /*
    Add an activity to the current workout.

    Note that when processing this form, we temporarily disable
    empty inputs to prevent them from being serialized.
   */
  $addActivityForm.on("submit", function(event) {
    event.preventDefault()

    const form = $(this)
    form.find("[name='workoutId']").val(Workouts.getCurrentId())
    trimFormInputs(form)
    getEmptyInputs(form).prop('disabled','disabled')

    const
      exerciseId = form.find("[name='exerciseId']").val(),
      countFilledValues = getNonemptyInputs(form).length

    if (!exerciseId) {
      showAlert("Please choose an exercise.")
    } else if (countFilledValues <= 1) {
      showAlert("Choose at least one target for this exercise.")      
    } else {
      saveActivity(form.serialize())
      form[0].reset()
    }

    getEmptyInputs(form).removeAttr('disabled')
  })


// --- API Calls ---

  /*
    Get all exercises, then fill in the drop-down.
   */
  function getExercises() {
    $.ajax({
      url: "/api/exercise",
      method: "GET"
    })
    .then(({status, data}) => {
      if ("success" === status) {
        Exercises.setAll(data)
        console.log(Exercises.getAll())
        renderExerciseDropDownList()
      } else {
        console.error(`getExercise() failed: ${data}`)
      }
    })
  }


  /*
    Get all workouts, then update the list.
   */
  function getWorkouts() {
    $.ajax({
      url: "/api/workout",
      method: "GET"
    }).then(({status, data}) => {
      if ("success" === status) {
        Workouts.setAll(data)
        console.log(Workouts.getAll())
        renderWorkoutList()
      } else {
        console.error(`getWorkouts() failed: ${data}`)
      }
    })
  }


  /*
    Save a workout, set it as the current item, then update the page.
   */
  function saveWorkout(workout) {
    $.ajax({
      url: "/api/workout",
      method: "POST",
      data: workout
    }).then(({status, data}) => {
      if ("success" == status) {
        Workouts.add(data)
        Workouts.setCurrentId(data.id)
        console.log(data)
        renderWorkoutList()
        renderActivityList()
      } else {
        console.error(`saveWorkout() failed: ${data}`)
      }
    })
  }


  /*
    Add an activity to the current workout, then update the page.
   */
  function saveActivity(activity) {
    $.ajax({
      url: "/api/activity",
      method: "POST",
      data: activity
    }).then(({status, data}) => {
      if ("success" === status) {
        console.log(data)
        Workouts.addCurrentActivity(data)
        console.log(Workouts.getAll())
        renderActivityList()
      } else {
        console.error(`saveActivity() failed: ${data}`)
      }
    })
  }


// --- Utility functions ---

  /*
   */
  function removeEmptyProperties(object) {
    for (let property in object) {
      if (null === object[property]) delete object[property]
      if (undefined === object[property]) delete object[property]
    }
    return object
  }


  /*
   */
  function getEmptyInputs(form) {
    return form.find("input").filter(function() {
      return "" === this.value
    })
  }


  /*
   */
  function getNonemptyInputs(form) {
    return form.find("input").filter(function() {
      return "" !== this.value
    })
  }


  /*
    Trim text across all input fields on a form.
   */
  function trimFormInputs(form) {
    form.children("input").val((index, value) => value.trim())
  }


  /*
    Get a nicely formatted date string. If date is null, the string will
    be for the current time.
   */
  function getDayString(date) {
    return moment(date).format("MMM DD, YYYY")
  }


// --- Start the app ---

  start()

})