const http = require('http')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
dotenv.config({ path: './.env'})


const port = 3000
const DATABASE = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
)


mongoose.connect(DATABASE)
  .then(() => console.log('DB connected'))
  .catch( (e) => console.log(`DB connect error: ${e}` ))

const requestHandler = (req, res) => {
  console.log('requestHandler')
}



const server = http.createServer( requestHandler )

server.listen(process.env.PORT || port, () => {
  console.log(`server on ${port}`);
})