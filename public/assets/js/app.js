$(document).ready(() => {

  function start() {
    getExercises();
    getWorkouts();
  }


  /*
    Local model state variables
   */
  let
    allExercises = [],
    allWorkouts = [],
    selectedWorkout = { activities: []}


  /** ********** DOM Population ********** */

  const
    workoutsList = $("#workouts-list ul")


  // Populate workout data
  // (If we're adding a new blank item to the list we will want to auto-select 
  // it, so that is handled in the params argument)
  function populateWorkouts(params){
    // const workoutsList = $("#workouts-list ul")
    // workoutsList.empty()

    $("#workouts-list").empty();
    const ul = $("<ul>");
    allWorkouts.forEach(workout => {
      const li = $("<li>")
        .addClass("workout-item")
        .attr("data-workout-id", workout.id)
        .html(`<span>${workout.day}</span> ${workout.name}`)

      // workoutsList.append(li)
     ul.append(li);
    });
   $("#workouts-list").append(ul);

    if (params && params.selectLatest) {
      $("#workouts-list li:last-child").addClass("selected");
    }
  }

  // STUDENTS: Populate activity data for the selected workout
  function populateActivities() {
    $("#activities-list").empty();
    const ul = $("<ul>");
    selectedWorkout.Activities.forEach(activity => {
      console.log(activity);

      const exerciseName = allExercises
        .filter(e => e.id === activity.ExerciseId)
        .map(e => e.name)[0]

      const
        activityHtml = `<span>${exerciseName}</span>`,
        exerciseTargets = [
          getActivityInfo(activity, 'duration'),
          getActivityInfo(activity, 'weight'),
          getActivityInfo(activity, 'reps'),
          getActivityInfo(activity, 'sets'),
          getActivityInfo(activity, 'distance')
        ].filter(t => t)

      
      console.log(activityHtml.concat(exerciseTargets.join(", ")))

      const li = $("<li>")
        .addClass("activity-item")
        .attr("data-activity-id", activity.id)
        .html(activityHtml + exerciseTargets.join(", "))

      // workoutsList.append(li)
     ul.append(li);
    });
   $("#activities-list").append(ul);
 
  }


  /*
    Fill the drop-down list with exercises to choose from.
   */
  function populateExercises() {
    allExercises.forEach(exercise => {
      const opt = $("<option>")
        .val(exercise.id)
        .text(exercise.name)

      $("select#exercise").append(opt)
    })
  }


  // --- Event handlers ---
  
  /*
    When an item in the workout list is clicked, show it on the right pane.
   */
  $("#workouts-list").on("click", ".workout-item", function(event) {
    event.preventDefault()

    $("#workouts-list li").removeClass("selected")
    $(this).addClass("selected")

    const id = $(this).attr("data-workout-id")
    selectedWorkout = allWorkouts.filter(w => w.id === parseInt(id))[0]

    $("#activity-header").text(`${selectedWorkout.name} - Activities`)
    $("div.right-column").show()

    populateActivities()
  })


  // Create a new empty workout for the user to work with
  $("button#add-workout").on("click", function(event) {
    event.preventDefault();
   const name = $("#workout-name").val().trim();
    selectedWorkout = { name: name, day: getDayString(), activities: [] };
    // selectedWorkout = addFormValue(selectedWorkout, "name")
    console.log(selectedWorkout)

    allWorkouts.push(selectedWorkout);

    console.log(allWorkouts)

    // Save to db via api
    saveSelectedWorkout();

    populateWorkouts({selectLatest: true})
    $("div.right-column").show()
  })

  // STUDENTS: Add an activity to the selected workout, then save via API
  $("button#add-activity").on("click", function(event) {
    event.preventDefault()

    let activity = {
      WorkoutId: selectedWorkout.id
    }
    activity = addFormValue(activity, 'ExerciseId')
    activity = addFormValue(activity, 'duration')
    activity = addFormValue(activity, 'weight')
    activity = addFormValue(activity, 'reps')
    activity = addFormValue(activity, 'sets')
    activity = addFormValue(activity, 'distance')

    console.log(activity)

    if (activity.ExerciseId) {
      saveActivity(activity)
    }
  })


  // --- API Calls ---

  /*
    Get all exercises.
   */
  function getExercises(){
    $.ajax({
      method: "GET",
      url: "/api/exercise"
    }).then(exercises => {
      allExercises = exercises
      populateExercises()
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
      populateWorkouts()
    })
  }

  // Save the currently selected workout
  function saveSelectedWorkout(){
    $.ajax({
      method: "POST",
      url: "/api/workout",
      data: selectedWorkout
    }).then(response => {
//      console.log(response)
      if (response && response.id) {
        selectedWorkout.id = parseInt(response.id)
      }
    })
  }

  // Add an activity to the current workout being viewed.
  // Save the currently selected workout
  function saveActivity(activity){
    $.ajax({
      method: "POST",
      url: "/api/activity",
      data: activity
    }).then(function(resp){

      console.log(resp)
    })
  }


  // --- Utility functions ---

  /*
   */
  function getActivityInfo(object, field) {
    return field in object && object[field] ?
      `<strong>${field}:</strong> ${object[field]}` :
      null
  }

  /*
    Add a form field's value to an object if it's set.
   */
  function addFormValue(result, field) {
    const value = $(`[name="${field}"`).val().trim()

    if (value) {
      result[field] = value
    }

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