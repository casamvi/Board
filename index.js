const http = require('http')
const fs = require('fs')
const querystring = require('querystring')

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

  console.time('Render')
  let render = (format, statusCode, content) => {
    requestLogging()
    responseTemplate(response, statusCode, `text/${format}`, content)
    console.timeEnd('Render')
  }
  
  if (request.url == '/board') {
    render('html', 200, 'Root!')
  }

  if (request.url == '/board/write') {
    if (request.method == 'GET') {
	  let viewFile = loadView('main/write.html')
	
      if (viewFile != null) {
        render('html', 200, viewFile)
      } else {
        render('plain', 500, viewFile)
      }
	} else if (request.method == 'POST') {
	  render('html', 200, 'POST Test\n')
	  request.on('data', (chunk) => { 
	    console.log(querystring.parse(chunk.toString()))
      })
	} else {
      render('html', 404, 'Not Found!') 
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
