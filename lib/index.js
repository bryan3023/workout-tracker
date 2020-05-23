function removeSequelizeColumns(record) {
  delete record.createdAt
  delete record.updatedAt
}

module.exports = {
  removeSequelizeColumns
}