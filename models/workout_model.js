/*
  Define the Workout model.
 */
module.exports = function (sequelize, DataTypes) {
    const Workout = sequelize.define("Workout", {
      exercise_type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1],
        },
      },
      exercise_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1],
        },
      }
    })
  
    return Workout
  }
  