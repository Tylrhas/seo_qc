var job_id = null
$('#crawl').click(function () {
  $('#results .table tbody tr').remove()
  job_id = null
  let url = $('#website').val()
  socket.emit('enqueue', { url })
  socket.on('enqueued', function (data) {
    job_id = data.id
    console.log(job_id)
  })
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
  }
})

socket.on('newJob', function (data) {
  addJob(data)
  $('#job-' + data.id).click(function () {
    let jobId = $(this).attr('jobId')
    socket.emit('deleteJob', jobId)
  })
})