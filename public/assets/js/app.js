$(document).ready(() => {

  function start() {
    getExercises()
    getWorkouts()
  }


  /*
    Local model state variables
   */
  let
    allExercises = [],
    allWorkouts = [],
    selectedWorkout = { Activities: []},
    selectedWorkoutId = null


  // --- DOM Population ---

  const
    $exerciseDropDown = $("select[name='ExerciseId']"),
    $workoutList = $("#workouts-list ul")


  // Populate workout data
  // (If we're adding a new blank item to the list we will want to auto-select 
  // it, so that is handled in the params argument)
  function renderWorkoutList(params) {
    // const workoutsList = $("#workouts-list ul")
    // workoutsList.empty()

    $("#workouts-list").empty();
    const ul = $("<ul>");
    allWorkouts.forEach(workout => {
      const li = $("<li>")
        .addClass("workout-item")
        .attr("data-workout-id", workout.id)
        .html(`<span>${workout.day}</span> ${workout.name}`)

        ul.append(li)
    })
    $("#workouts-list").append(ul)

    if (params && params.selectLatest) {
      $("#workouts-list li:last-child").addClass("selected")
    }
  }


  // STUDENTS: Populate activity data for the selected workout
  function renderActivityList() {
    $("#activities-list").empty()
    const ul = $("<ul>")
    selectedWorkout.Activities.forEach(activity => {
      console.log(activity)

      const
        exerciseName = getExerciseNameById(activity.ExerciseId),
        activityHtml = `<span>${exerciseName}</span>`,
        exerciseTargets = [
          getActivityTargetString(activity, 'duration'),
          getActivityTargetString(activity, 'weight'),
          getActivityTargetString(activity, 'reps'),
          getActivityTargetString(activity, 'sets'),
          getActivityTargetString(activity, 'distance')
        ].filter(t => t)


      const li = $("<li>")
        .addClass("activity-item")
        .attr("data-activity-id", activity.id)
        .html(activityHtml + exerciseTargets.join(", "))

      // workoutsList.append(li)
     ul.append(li)
    })
   $("#activities-list").append(ul)
 
  }


  /*
    Fill the drop-down list with exercises to choose from.
   */
  function renderExerciseDropDownList() {
    allExercises.forEach(exercise => {
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
  $("#workouts-list").on("click", ".workout-item", function(event) {
    event.preventDefault()

    $("#workouts-list li").removeClass("selected")
    $(this).addClass("selected")
    console.log(this)
    const id = $(this).attr("data-workout-id")
    console.log(id)
    selectedWorkout = allWorkouts.filter(w => w.id === parseInt(id))[0]
    selectedWorkoutId = id
    console.log(selectedWorkoutId)
    console.log(getWorkoutById(selectedWorkoutId))

    const workout = getWorkoutById(id)

//    $("#activity-header").text(`${selectedWorkout.name} - Activities`)
    $("#activity-header").text(`${workout.name} - Activities`)
    $("div.activity-pane").show()

    renderActivityList()
  })


  // Create a new empty workout for the user to work with
  $("button#add-workout").on("click", function(event) {
    event.preventDefault();

    let workout = { day: getDayString() }
    workout = addFormValue(workout, "name")

    console.log(workout)

    selectedWorkout = workout

    console.log(allWorkouts)

    // Save to db via api
    saveWorkout(workout)

    renderWorkoutList({selectLatest: true})
    $("div.activity-pane").show()
  })

  // STUDENTS: Add an activity to the selected workout, then save via API
  $("button#add-activity").on("click", function(event) {
    event.preventDefault()

    let activity = {
      WorkoutId: selectedWorkoutId
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
    Get all exercises and fill in thr drop-down.
   */
  function getExercises() {
    $.ajax({
      method: "GET",
      url: "/api/exercise"
    }).then(exercises => {
      allExercises = exercises
      renderExerciseDropDownList()
    })
  }


  /*
    Get all workouts.
   */
  function getWorkouts() {
    $.ajax({
      url: "/api/workout",
      method: "GET"
    }).then(workouts => {
      workouts.forEach(w => w.day = getDayString(w.day))
      allWorkouts = workouts
      renderWorkoutList()
    })
  }

  // Save the currently selected workout
  function saveWorkout(workout) {
    $.ajax({
      method: "POST",
      url: "/api/workout",
      data: workout
    }).then(response => {
      if (response && response.id) {
        selectedWorkout.id = parseInt(response.id)
        selectedWorkoutId = parseInt(response.id)
        response.Activities = []
        response.day = getDayString(response.day)
        allWorkouts.push(response)
        console.log(allWorkouts)
      }
      renderWorkoutList({selectLatest: true})
    })
  }

  // Add an activity to the current workout being viewed.
  // Save the currently selected workout
  function saveActivity(activity) {
    $.ajax({
      method: "POST",
      url: "/api/activity",
      data: activity
    }).then(function(resp){
//      selectedWorkout.Activities.push(activity)
      addActivityByWorkoutId(selectedWorkoutId, activity)
      renderActivityList()
      console.log(resp)
    })
  }


  // --- Utility functions ---

  /*
    Get a workout with the specified ID.
   */
  function getWorkoutById(id) {
    return allWorkouts.filter(w => w.id === parseInt(id))[0]
  }


  /*
    Get the name of an exercise with the specified ID.
   */
  function getExerciseNameById(id) {
    return allExercises
      .filter(e => e.id === id)
      .map(e => e.name)[0]
  }


  function addActivityByWorkoutId(workoutId, activity) {
    getWorkoutById(workoutId).Activities.push(activity)
  }


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