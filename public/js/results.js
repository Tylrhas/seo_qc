function addrow (data) {
  let altText = '<td>' + data.altText + '</td>'
  let imgSrc = '<td class="thumbnail"><img src="' + data.imgSrc + '"/></td>'
  let pageURL = '<td>' + data.pageURL + '</td>'
  let row = '<tr>'+ imgSrc + altText + pageURL + '</tr>' 
  let table = $('#results .table tbody')
  $(table).append(row)
}