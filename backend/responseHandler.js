const { HEADERS } = require('./constants')

const successHandler = ( response, data) => {
  response.writeHead( 200, HEADERS)
  response.write(JSON.stringify({
    status : "success",
    data
  }))
  response.end()
}

const errorHandler = (response, statusCode = 500 , message = '有錯誤') => {
  response.writeHead( statusCode, HEADERS)
  response.writeHead(JSON.stringify({
    status : false,
    message
  }))
  response.end()
}

module.exports = {
  successHandler, 
  errorHandler
}