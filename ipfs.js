var http = require('http')

http.createServer((request, response) => {
  const { headers, method, url } = request;
  let body = [];
  request.on('error', (err) => {
    console.error(err);
  }).on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();

    response.on('error', (err) => {
      console.error(err);
    });
    
    if(method === 'GET' && url.indexOf('/get/') !== -1){
        const hash = url.replace('/get/','',url)
        if(hash.length === 46){
            const IPFS = require('ipfs')
            const node = new IPFS({ repo: '~/.ipfs' })
            node.on('ready', () => {
                node.cat(hash, function (err, file) {
                    if (err) {
                        throw err
                    }
                    //NEED TO READ MIMETYPE
                    //response.setHeader('Content-Type', 'application/json');
                    //WRITE FILE TO RESPONSE
                    response.write(file)
                    response.end()
                    node.stop()
                })
            })
        }else{
            response.statusCode = 404;
            response.write('PROVIDE IPFS HASH FIRST')
            response.end()
        }
    }
  });
}).listen(3000);