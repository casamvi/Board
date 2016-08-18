const http = require('http')
const fs = require('fs')
const characterSet = 'utf-8'
const appDir = 'app'
const viewDir = appDir + '/view'

const hostname = '127.0.0.1'
const port = 3000

const responseTemplate = (content, statusCode, contentType) => {
  response.statusCode = statusCode
  response.setHeader('Content-Type', contentType)
  response.end(content)
}

const loadFile = (path) => {
  fs.readFile(path, characterSet, (err, data) => {
	if (err) {
	  return ['', err] 
	}

	[data, '']
  })
}

const requestHandler = (request, response) => {
  if (request.url == '/') {
    responseTemplate('Root!', 200, 'text/plain')
  }

  if (request.url == '/board') {
	let file = loadFile(`${viewDir}/main/writer.html`)
	
	if (file[1] == '') {
	  responseTemplate(file[0], 200, 'text/html')
	} else {
	  responseTemplate(file[1], 500, 'text/plain')
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
