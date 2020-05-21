/*
  Define the Activity model, which consists of an exercise and the conditions
  to perform it under.
 */
module.exports = function(sequelize, DataTypes) {
  const Activity = sequelize.define("Activity", {
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

  return Activity
}
