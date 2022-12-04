import http from 'http'
import fs from 'fs'
import path from 'path'

http.createServer((req, res) => {
  console.log(req.url)
  if (/dist/.test(req.url)) {
    res.setHeader('content-type', 'application/javascript')
    res.end(fs.readFileSync(path.join('./', req.url)))
  } else if (req.url === '/') {
    res.setHeader('content-type', 'text/html')
    res.end(fs.readFileSync(path.resolve('./playground/index.html')))
  }
}).listen(3000, () => {
  console.log('服务启动：' + 'http://localhost:3000')
})
