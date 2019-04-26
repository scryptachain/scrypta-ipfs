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
              if(hash){ 
                node.cat(hash, function (err, file) {
                    if (err) {
                        throw err
                    }
                    const fileType = require('file-type')
                    var mimetype = fileType(file)
                    if(mimetype){
                      response.setHeader('Content-Type', mimetype.mime);
                    }
                    response.end(file)
                    node.stop()
                })
              }
            })

              /*

            node.on('ready', () => {
              const content = IPFS.Buffer.from(contents)
              node.add(content).then(results => {
                const hash = results[0].hash
                if(hash){ 
                  node.cat(hash, function (err, file) {
                      if (err) {
                          throw err
                      }
                      //NEED TO READ MIMETYPE
                      node.stop()
                  })
                }
              })
            })*/
              
        }else{
            response.statusCode = 404;
            response.write('PROVIDE IPFS HASH FIRST')
            response.end()
        }
    } //GET METHOD
    
  });
}).listen(3000);