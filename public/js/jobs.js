function addJob (data) {
  let id = '<td>' + data.id + '</td>'
  let url = '<td>' + data.url + '</td>'
  let processing = '<td>' + data.processing + '</td>'
  let created = '<td>' + data.createdAt + '</td>'
  let updated = '<td>' + data.updatedAt + '</td>'
  let row = '<tr id="' + data.id + '">'+ id + url + processing + created + updated + '</tr>' 
  let table = $('#jobs .table tbody')
  $(table).append(row)
}
function removeJob (id) {
$('#' + id ).remove()
}