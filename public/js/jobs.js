function addJob (data) {
  let id = '<td>' + data.id + '</td>'
  let url = '<td>' + data.url + '</td>'
  let processing = '<td>' + data.processing + '</td>'
  let created = '<td>' + data.createdAt + '</td>'
  let updated = '<td>' + data.updatedAt + '</td>'
  let deleteButton = '<td> <button class="btn btn-danger" Jobid="' + data.id + '">Delete Job</button></td>'
  let row = '<tr id="' + data.id + '">'+ id + url + processing + created + updated + deleteButton + '</tr>' 
  let table = $('#jobs .table tbody')
  $(table).append(row)
}
function removeJob (id) {
$('#' + id ).remove()
}