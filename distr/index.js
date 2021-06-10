"use strict";

var _request = _interopRequireDefault(require("./common/request"));

var _proxy = _interopRequireDefault(require("./common/proxy"));

var _settings = _interopRequireDefault(require("./common/settings"));

var _log = _interopRequireDefault(require("./common/log"));

var _parser = _interopRequireDefault(require("./common/parser"));

var _server = _interopRequireDefault(require("./common/server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import Net from 'net';
async function start() {
  const botSettings = new _settings.default(_request.default);
  const log = new _log.default(_request.default, botSettings);
  let proxy = new _proxy.default(_request.default, botSettings, log);
  proxy = await proxy.setProxyList();
  const parser = new _parser.default(_request.default, botSettings, log, proxy);
  const server = new _server.default(botSettings, parser, log);
  process.on('SIGINT', () => {
    //  console.log('ghghghghgg');
    log.info({
      mess: 'kill'
    });
  });
}

start();