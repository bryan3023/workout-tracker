'use strict'

const row = (object) => {
  object.createdAt = new Date()
  object.updatedAt = new Date()

  return object
}

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.bulkInsert('Exercises', [
      row({
        exercise_type: 'cardio',
        exercise_name: 'stairmaster'
      }),
      row({
        exercise_type: 'strength',
        exercise_name: 'barbell curl'
      }),
      row({
        exercise_type: 'strength',
        exercise_name: 'lateral curl'
      }),
      row({
        exercise_type: 'strength',
        exercise_name: 'benchpress'
      }),
      row({
        exercise_type: 'cardio',
        exercise_name: 'treadmill'
      }),
      row({
        exercise_type: 'stretching',
        exercise_name: 'single-knee rotation'
      }),
      row({
        exercise_type: 'balance',
        exercise_name: 'standing knee lift'
      })
    ], {}),

  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete('Exercises', null, {})
}
