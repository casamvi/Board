const http = require('http')
const fs = require('fs')

const characterSet = 'utf-8'
const appDir = 'app'
const viewDir = appDir + '/view'

const hostname = '127.0.0.1'
const port = 3000

const responseTemplate = (response, statusCode, contentType, content) => {
  response.statusCode = statusCode
  response.setHeader('Content-Type', contentType)
  response.end(content)
}

const responseHtmlTemplate = (response, statusCode, content) => responseTemplate(response, statusCode, 'text/html', content)
const responsePlainTemplate = (response, statusCode, content) => responseTemplate(response, statusCode, 'text/plain', content)

const loadView = (path) => {
  let viewPath = (path.indexOf('/') == 0 ? viewDir : viewDir + '/') + path

  return fs.readFileSync(viewPath, characterSet)
}

const requestLoggingTemplate = (request) => {
  let currentTime = new Date()

  console.log('')
  console.log(`[${currentTime}] ${request.method} ${request.headers.host}${request.url}`)
  console.log(request.headers['user-agent'])
}

const requestHandler = (request, response) => {
  let requestLogging = () => requestLoggingTemplate(request)

  class ResponseSet {
    html(statusCode, content) { responseHtmlTemplate(response, statusCode, content) }
    plain(statusCode, content) { responsePlainTemplate(response, statusCode, content) }
  }

  let responseSet = new ResponseSet(response)

  console.time('Render')
  let render = (format, statusCode, content) => {
    requestLogging()
    responseSet[format](statusCode, content)
    console.timeEnd('Render')
  }
  
  if (request.url == '/') {
    render('html', 200, 'Root!')
  }

  if (request.url == '/board') {
	  let viewFile = loadView('main/write.html')

    if (viewFile != null) {
      render('html', 200, viewFile)
    } else {
      render('plain', 500, viewFile)
    }
  }
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('Sommting bad happened', err)
  }

  console.log(`Server running at http://${hostname}:${port}/`)
})
