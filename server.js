var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
app.use(express.static(__dirname + '/public'))
var models = require('./app/models')

// include needed files
var jobs = require('./app/lib/jobs')
var crawl = require('./app/lib/crawl')

// get env vars from .env file
require('dotenv').config()

app.set('views', './app/views')
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('pages/index'
    // ,{ user: req.user, jobs: results[0], dictionary: results[1] }
  )
})

io.on('connection', function (socket) {
  // get all the jobs currently in the queue
  jobs.current().then(currentjobs => {
    let currentJobsArray = []
    if (currentjobs.length > 0) {
    for (i=0; i < currentjobs.length; i++) {
      let job = currentjobs[i]
      currentJobsArray.push({id: job.id, url: job.url, processing: job.processing, createdAt: job.createdAt, updatedAt: job.updatedAt})
    }
  }
  socket.emit('currentJobs', currentJobsArray)
  })
  console.log('a user connected');
  socket.on('enqueue', function (data) {
    // enqueue the website
    jobs.enqueue(data.url).then(job => {
      // let the user know the job is enqueued
      socket.emit('enqueued', job.dataValues)
      // enqueue the job on all the other users job tab
      io.emit('newJob', job.dataValues)
      // check if there is a job processing already
      jobs.process().then(job => {
        if (!job) {
          crawl.start(io)
        }
      })
    })
  })
  socket.on('deleteJob', function (jobId) {
    jobs.remove(jobId).then(() => {
      socket.emit('jobDeleted', jobId)
    })
  })
})

// Sync Database
models.sequelize.sync().then(function () {
  console.log('Nice! Database looks fine')
  // load the custom dict
}).catch(function (err) {
  console.log(err, 'Something went wrong with the Database Update!')
})

http.listen(process.env.PORT, function () {
  console.log('listening on ' + process.env.PORT);
})
