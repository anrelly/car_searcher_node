"use strict";

var _request = _interopRequireDefault(require("./common/request"));

var _settings = _interopRequireDefault(require("./common/settings"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const https = require('http');

const data = JSON.stringify({
  todo: 'Buy the milk'
});
const options = {
  auth: 'admin:25117600',
  hostname: 'api.marcomarello.ru',
  port: 80,
  protocol: 'http:',
  path: '/api/v1/receive-parse-data',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

function ttt() {
  const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`);
    console.log(`res: ${res}`);
    res.on('data', d => {
      //process.stdout.write(d)
      console.log(d);
    });
  });
  req.on('error', error => {
    console.log(error);
  });
  req.write(data);
  req.end();
}

ttt();

function rrr() {
  let sendData = {
    data: 25
  };

  const send = _request.default.post(`http://admin:25117600@api.marcomarello.ru/api/v1/receive-parse-data`, sendData).then(function (res) {
    console.log(res);

    if (res.status == true) {
      console.log('send_api_success: ', 'code: ' + res.code);
    } else {
      console.log('send_api_error: ', 'code: ' + res.code);
    }
  });
}

for (let j = 0; j < 100; j++) {
  for (let i = 0; i < 100; i++) {
    ttt();
  }
} ////var express = require('express');
//var app = express();
//var morgan = require('morgan')
//
//var myLogger = function (req, res, next) {
//  console.log('LOGGED');
//  next();
//};
//
//app.use(myLogger);
//
//app.use(morgan('combined'));
//
////app.post('/request', function (req, res) {
////  res.send('Hello World!');
////});
//
//
////app.listen(3010);