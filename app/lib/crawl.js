module.exports = {
  start
}

const puppeteer = require('puppeteer')
const db = require('../models')
var jobs = require('../lib/jobs')

async function start (io) {
  var results = []
  var crawled = []
  var urls = []
  var job = await jobs.getNext()
  var url = job[0].url
  if (url.substr(url.length - 1) === '/') {
    url = url.slice(0, -1)
  }
  var homepage = url
  // what enviornment is this running on 
  if (process.env.ENVIRONMENT === 'heroku') {
    args = { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
  } else if (process.env.ENVIRONMENT === 'local') {
    // set headless to false so you can see what page it is on
    args = {
      headless: false
    }
  } else {
    // running elseware no need for special configs
    args = {}
  }

  // initilize the browser
  puppeteer.launch(args).then(browser => {
    browser.newPage().then(page => {
      page.on('error', (error) => {
        console.log('Page Error:', error)
      })
      io.emit('jobStart', job[0])
      try {
        page.goto(url).then(navigation => {
          getLinks(page, urls, url, crawled, homepage, results).then(urls => {
            qcPage(page, url, crawled, browser, urls, io, job, homepage, results)
          })
        })
      } catch (error) {
        // do someting with the error
      }
    })
  })
}


async function getLinks (page, urls, url, crawled, homepage, results) {
  // scrape all ancors on the page
  var anchors = await page.$$eval('a', links => {
    let allAnchors = links.map((link) => link.href)

    return allAnchors
  })

  // add the ancors to the existing urls array
  var allAnchors = urls.concat(anchors)

  // remove duplicates, urls of a different domains and phone numbers
  let uniqueArray = []
  for (let i = 0; i < allAnchors.length; i++) {
    console.log(allAnchors[i])
    if (uniqueArray.indexOf(allAnchors[i]) === -1 && allAnchors[i].includes(homepage) === true && crawled.indexOf(allAnchors[i].replace(/\/$/, '')) === -1 && allAnchors[i].includes('#') === false) {
      // push the URL without the trailing /
      uniqueArray.push(allAnchors[i].replace(/\/$/, ''))
    }
  }
  return uniqueArray
}

function qcPage (page, url, crawled, browser, urls, io, job, homepage, results) {
  // rejected classes 

  // get all images on the page
  page.$$eval('.widget:not(.social-feed):not(.map):not(.directions) img', images => {
    // get the image url and the alt text for it
    return images.map((img) => {
      return { imgSrc: img.src, altText: img.alt }
    })
  }).then(images => {
    console.log(images)
    images.forEach(image => {
      image.pageURL = url
      results.push(image)
    })
    // push the urls to the crawled array
    crawled.push(url)
    // get links on the page
    getLinks(page, urls, url, crawled, homepage, results).then(links => {
      // set the list of new links to url
      urls = links
      // Move to the next page and run crawl
      nextPage(crawled, urls, page, browser, io, job, homepage, results)
    })
  })
}
function nextPage (crawled, urls, page, browser, io, job, homepage, results) {
  if (urls.length > 0) {
    var newPage = urls.pop()
    page.goto(newPage).then(naviation => {
      return qcPage(page, newPage, crawled, browser, urls, io, job, homepage, results)
    })
      .catch(error => {
        // there was an error loading the page
        g5QualityControl.error = error
      })
  } else {
    browser.close()
    // add job id to the results
    results = {
      results: results,
      job: {
        id: job[0].id
      }
    }
    io.emit('complete', results)
    job[0].destroy().then(() => {
      db.jobQueue.count().then(jobQueue => {
        if (jobQueue > 0) {
          return start(io)
        }
      })
    })
  }
}