// --- A few helper functions to keep API results clean ---

/*
  Remove a record's timestamp colomns.
 */
function removeSequelizeColumns(record) {
  delete record.createdAt
  delete record.updatedAt
}

/*
  Remove properties that were null.
 */
function removeEmptyProperties(object) {
  for (let property in object) {
    if (null === object[property]) delete object[property]
    if (undefined === object[property]) delete object[property]
  }
  return object
}


module.exports = {
  removeSequelizeColumns,
  removeEmptyProperties
}