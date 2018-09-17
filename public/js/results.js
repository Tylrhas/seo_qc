function addrow (data) {
  let altText = '<td>' + data.altText + '</td>'
  let imgSrc = '<td class="thumbnail"><img src="' + data.imgSrc + '"/></td>'
  let pageURL = '<td><a href="' + data.pageURL + '" target="_blank">' + data.pageURL + '</a></td>'
  let row = '<tr>'+ imgSrc + altText + pageURL + '</tr>' 
  let table = $('#results .table tbody')
  $(table).append(row)
}