var formidable = require('formidable')
var express = require('express')
var fs = require('fs')
const fileType = require('file-type')

var app = express()

app.post('/add', function (req, res){
  setTimeout(function () {
    var form = new formidable.IncomingForm();
    form.parse(req)
    form.on('file', function (name, file){
        fs.readFile(file.path, function(error, content){
          const IPFS = require('ipfs')
          const node = new IPFS({ repo: '~/.ipfs' })
          node.on('ready', () => {
            node.add(content).then(results => {
              const hash = results[0].hash
              res.send({
                data: {
                  hash: hash
                },
                status: 200
              })
              node.stop()
            })
          })
        })
    });
  }, 10 * Math.floor((Math.random() * 10) + 1))
});

app.post('/verify/:hash', function (req, res){
  setTimeout(function () {
    var hash = req.params.hash
    var form = new formidable.IncomingForm();
    form.parse(req)
    form.on('file', function (name, file){
        fs.readFile(file.path, {onlyHash: true}, function(error, content){
          const IPFS = require('ipfs')
          const node = new IPFS({ repo: '~/.ipfs' })
          node.on('ready', () => {
            node.add(content).then(results => {
              var calculated = results[0].hash
              if(calculated !== hash){
                res.send(false)
              }else{
                res.send(true)
              }
              node.stop()
            })
          })
        })
    });
  }, 10 * Math.floor((Math.random() * 10) + 1))
});

app.get('/get/:hash', function (req, res){
  setTimeout(function () {
    const IPFS = require('ipfs')
    const node = new IPFS({ repo: '~/.ipfs' })
    const hash = req.params.hash

    node.on('ready', () => {
      node.cat(hash, function (err, file) {
        if (err) {
            throw err
        }
        var mimetype = fileType(file)
        if(mimetype){
          res.setHeader('Content-Type', mimetype.mime);
        }
        res.end(file)
        node.stop()
      })
    })
  }, 10 * Math.floor((Math.random() * 10) + 1))
});

app.get('/readpin', function (req, res){
  setTimeout(function(){
    const IPFS = require('ipfs')
    const node = new IPFS({ repo: '~/.ipfs' })

    node.on('ready', () => {
      node.pin.ls({ type: 'recursive' }, function (err, pinset) {
        if (err) {
          throw err
        }
        res.send({
          data: pinset,
          status: 200
        })
        node.stop()
      })
    })
  }, 10 * Math.floor((Math.random() * 10) + 1))
});

app.listen(3000);