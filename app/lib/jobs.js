db = require('../models')
module.exports = {
  enqueue,
  process,
  getNext
}

function enqueue (url) {
  return db.jobQueue.create({ url })
}
function process () {
  return db.jobQueue.findOne({
    where: {
      processing: true
    }
  })
}

function getNext () {
  return db.jobQueue.findAll({ limit: 1 })
}