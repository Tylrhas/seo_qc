var job_id = null
$('#crawl').click(function () {
  $('#results .table tbody tr').remove()
  job_id = null
  let url = $('#website').val()
  socket.emit('enqueue', { url })
  socket.on('enqueued', function (data) {
    job_id = data.id
    console.log(job_id)
    $('#crawl').html('Enqueued')
  })
})
socket.on('jobStart', function (id) {
  if (id === job_id) {
    $('#crawl').html('Running')
  }
})

socket.on('complete', function (data) {
  // remove the job from the queue and add the results
  removeJob(data.job.id)
  console.log(data.job.id)
  console.log(job_id)
  if (data.job.id === job_id) {
    for (i = 0; i < data.results.length; i++) {
      addrow(data.results[i])
    }
    $('#crawl').html('Crawl')
  }
})

socket.on('newJob', function (data) {
  addJob(data)
})

socket.on('jobDeleted', function (jobId) {
  $('#'+jobId).remove()
})
socket.on('currentJobs', function (data) {
  for (i = 0; i <data.length; i++) {
    addJob(data[i])
  }
})