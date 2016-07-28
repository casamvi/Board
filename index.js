const http = require('http')

const hostname = '127.0.0.1'
const port = 3000

const requestHandler = (request, response) => {
  var response_template = (content) => {
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/plain')
    response.end(content)
  }

  if (request.url == '/') {
    response_template('Root!')
  }

  if (request.url == '/board') {
    switch (request.method) {
    case 'GET':
      response_template('Board Show!')
      break
    case 'POST':
      response_template('Board Create!')
      break
    case 'PUT':
      response_template('Board Update!')
      break;
    case 'DELETE':
      response_template('Board Delete!')
      break;
    default:
      response_template('Board Index!')
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
