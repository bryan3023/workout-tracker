/*
  Define the Workout model.
 */
module.exports = function(sequelize, DataTypes) {
  const Workout = sequelize.define("Workout", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  })

  Workout.associate = function(models) {
    Workout.hasMany(models.Activity, {
      onDelete: "cascade"
    })
  }

  return Workout
}
