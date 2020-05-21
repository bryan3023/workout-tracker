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
        type: 'cardio',
        name: 'stairmaster'
      }),
      row({
        type: 'strength',
        name: 'barbell curl'
      }),
      row({
        type: 'strength',
        name: 'lateral curl'
      }),
      row({
        type: 'strength',
        name: 'benchpress'
      }),
      row({
        type: 'cardio',
        name: 'treadmill'
      }),
      row({
        type: 'stretching',
        name: 'single-knee rotation'
      }),
      row({
        type: 'balance',
        name: 'standing knee lift'
      })
    ], {}),

  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete('Exercises', null, {})
}
