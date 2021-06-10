"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _os = _interopRequireDefault(require("os"));

var _pm = _interopRequireDefault(require("pm2"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Settings {
  constructor(axios) {
    this.controller = {};
    this.bot = {};
    this.axios = axios;
    this.controller.ip = '5.101.121.179';
    this.controller.host = 'api.marcomarello.ru';
    this.controller.protocol = 'http://';
    this.controller.user = 'admin';
    this.controller.password = '25117600';
    this.controller.basicAuth = 1;
    this.controller.api = '/api/v1/';
    this.bot.port = 3010;
    this.bot.cpus = _os.default.cpus().length;
    this.bot.pid = process.pid;
    this.bot.id = 5;
  }

  get hostController() {
    if (this.controller.basicAuth == 1) {
      return `${this.controller.protocol}${this.controller.user}:${this.controller.password}@${this.controller.host}${this.controller.api}`;
    }

    return `${this.controller.protocol}${this.controller.host}${this.controller.api}`;
  }

  async runProcess() {
    let pids = [];
    return new Promise((resolve, reject) => {
      _pm.default.list((err, list) => {
        if (err) {
          reject(err);
        } else {
          list.forEach(function (item) {
            pids.push(item.pid);
          });
          resolve(pids);
        }
      });
    });
  }

}

exports.default = Settings;