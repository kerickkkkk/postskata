const http = require('http')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const { HEADERS } = require('./constants')
const { successHandler, errorHandler } = require('./responseHandler')
dotenv.config({ path: './.env'})

const {Post} = require('./models/posts')

const port = 3000
const DATABASE = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
)
// 本地使用
// const DATABASE = 'mongodb://localhost:27017/posts'

mongoose.connect(DATABASE)
  .then(() => console.log('DB connected'))
  .catch( (e) => console.log(`DB connect error: ${e}` ))

const requestHandler = async ( request, response) => {
  let body = ''
  request.on('data', chunk => {
    body += chunk
  })
  const { url , method } = request
  if(url === '/posts' && method === 'GET'){
    const posts =  await Post.find({})
    successHandler(response, posts)
  }else if( url === '/posts' && method === 'POST'){
    request.on('end', async () => {
      try {
        const params = JSON.parse(body)
        const { name, content } = params
        if( !name || !content) {
          errorHandler( response, 400, '姓名 或者 內容不得為空')
        }
        // const post = new Post( params )
        // const result = await post.save()
        const result = await Post.create( params )
        successHandler(response, result)
      } catch (error) {
        errorHandler( response, 500, '伺服器有誤')
      }
    })
  }else if( url === '/posts' && method === 'DELETE'){
    try {
      await Post.deleteMany({})
      successHandler( response, `已刪除 全部 Posts`)
    } catch (error) {
      errorHandler( response, 500, '有一些錯誤')
    }
  }else if(url.startsWith('/posts/') && method === 'DELETE') {
    try {
      const id = url.split('/posts/')[1]
      await Post.findByIdAndDelete(id)
      successHandler(response, `已刪除ID : ${ id}`)
    } catch (error) {
      errorHandler(response, 404, '查無此ID')
    }
  }else if(url.startsWith('/posts/') && method === 'PATCH') {
    request.on('end', async()=>{
      try {
        const id = url.split('/posts/')[1]
        // 判斷 id 是否存在 
        // const idExist = await Post.findById(id)
        const params = JSON.parse(body)
        const result = await Post.findByIdAndUpdate(id, params)
        successHandler(response, result)
      } catch (error) {
        errorHandler(response, 400, error)
      }
    })
  }else if(method === 'OPTIONS'){
    response.writeHead( 200, HEADERS)
    response.end()
  }else{
    errorHandler( response, 400 ,'無此路由')
  }
}

const server = http.createServer( requestHandler )

server.listen(process.env.PORT || port, () => {
  console.log(`server on ${port}`);
})