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

    set(exercises) {
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

    set(workouts) {
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
      workout.Activities = []
      workout.day = getDayString(workout.day)
      console.log(workout)

      this.workouts.push(workout)
    },

    getCurrentActivities() {
      return this.getCurrent().Activities
    },

    addCurrentActivity(activity) {
      this.getCurrentActivities().push(activity)
    }
  }


  

  const
    $exerciseDropDown = $("select[name='ExerciseId']"),
    $workoutList = $("#workouts-list ul"),
    $activityList = $("#activities-list ul"),
    $addWorkoutButton = $("button#add-workout"),
    $addActivityButton = $("button#add-activity")


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
      console.log(activity)

      const
        exerciseName = Exercises.getName(activity.ExerciseId),
        activityHtml = `<span>${exerciseName}</span>`,
        exerciseTargets = [
          getActivityTargetString(activity, 'duration'),
          getActivityTargetString(activity, 'weight'),
          getActivityTargetString(activity, 'reps'),
          getActivityTargetString(activity, 'sets'),
          getActivityTargetString(activity, 'distance')
        ].filter(t => t)


      const $activityItem = $("<li>")
        .addClass("activity-item")
        .attr("data-activity-id", activity.id)
        .html(activityHtml + exerciseTargets.join(", "))

      $activityList.append($activityItem)
    })
    renderActivitiesHeader()
    $("div.activity-pane").show()
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

    const workout = Workouts.getCurrent()

    renderActivityList()
  })


  // Create a new empty workout for the user to work with
  $addWorkoutButton.on("click", function(event) {
    event.preventDefault();

    let workout = { day: getDayString() }
    workout = addFormValue(workout, "name")

    console.log(workout)

    // Save to db via api
    saveWorkout(workout)

    renderWorkoutList()
  })

  // STUDENTS: Add an activity to the selected workout, then save via API
  $addActivityButton.on("click", function(event) {
    event.preventDefault()

    let activity = {
      WorkoutId: Workouts.getCurrentId()
    }
    activity = addFormValue(activity, 'ExerciseId')
    activity = addFormValue(activity, 'duration')
    activity = addFormValue(activity, 'weight')
    activity = addFormValue(activity, 'reps')
    activity = addFormValue(activity, 'sets')
    activity = addFormValue(activity, 'distance')

    if (!activity.ExerciseId) {
      showAlert("Please choose an exercise.")
    } else if (Object.keys(activity).length <= 2) {
      showAlert("Choose at least one target for this exercise.")      
    } else {
      saveActivity(activity)
    }
  })


// --- API Calls ---

  /*
    Get all exercises and fill in the drop-down.
   */
  function getExercises() {
    $.ajax({
      method: "GET",
      url: "/api/exercise"
    }).then(exercises => {
      Exercises.set(exercises)
      renderExerciseDropDownList()
    })
  }


  /*
    Get all workouts and update the list.
   */
  function getWorkouts() {
    $.ajax({
      url: "/api/workout",
      method: "GET"
    }).then(workouts => {
      Workouts.set(workouts)
      renderWorkoutList()
    })
  }

  // Save the currently selected workout
  function saveWorkout(workout) {
    $.ajax({
      method: "POST",
      url: "/api/workout",
      data: workout
    }).then(({status, data}) => {
      if ("success" == status) {
        Workouts.add(data)
        Workouts.setCurrentId(data.id)
        renderWorkoutList()
        renderActivityList()
      }
    })
  }

  // Add an activity to the current workout being viewed.
  // Save the currently selected workout
  function saveActivity(activity) {
    $.ajax({
      method: "POST",
      url: "/api/activity",
      data: activity
    }).then(({status, data}) => {
      if ("success" === status) {
        console.log(data)
        Workouts.addCurrentActivity(data)
        renderActivityList()
      }
    })
  }


// --- Utility functions ---

  /*
    If an activity's target has a value, render HTML for that target.
   */
  function getActivityTargetString(object, field) {
    return field in object && object[field] ?
      `<strong>${field}:</strong> ${object[field]}` :
      null
  }


  /*
    Add a form field's value to an object if it's set.
   */
  function addFormValue(result, field) {
    const value = $(`[name="${field}"`).val().trim()
    if (value) result[field] = value
    return result
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