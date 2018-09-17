db = require('../models')
module.exports = {
  enqueue,
  process,
  getNext,
  current,
  remove
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
function remove (jobId) {
  return db.jobQueue.findAll({
    where: {
      id: jobId
    }
  }).then(job => {
    return job[0].destroy()
  })
}

function current () {
  return db.jobQueue.findAll()
}