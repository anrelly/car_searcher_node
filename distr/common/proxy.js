"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class Proxy {
  constructor(request, settings, log) {
    this.request = request;
    this.settings = settings;
    this.log = log;
    this.ProxyList = [];
    this.index = 0;
  }

  async setProxyList() {
    let tmpPids = await this.settings.runProcess();
    let tmp = await this.request.post(`${this.settings.hostController}get-proxy-list`, {
      bot: this.settings.bot.id,
      bot_pid: this.settings.bot.pid,
      bot_cpus: this.settings.bot.cpus,
      all_pids: tmpPids
    });

    if (tmp.status == true && tmp.response.error == 0) {
      this.ProxyList = tmp.response.pool;
      this.index = 0;
      this.log.success({
        message: 'Получен новый прокси лист'
      });
    } else {
      this.ProxyList = [];
      this.index = 0;
      this.log.error({
        message: 'Произошла ошибка при получении прокси листа'
      });
    }

    return this;
  }

  getProxy() {
    let self = this;
    return new Promise((resolve, reject) => {
      let count = self.ProxyList.length;

      if (count <= 0) {
        reject({
          status: 0
        });
      } else {
        resolve({
          status: 1,
          proxy: self.ProxyList[self.index]
        }); // resolve({status:1,proxy:self.ProxyList[self.index],login:self.login,password:self.password});
      }

      self.index++;

      if (self.index >= count) {
        self.index = 0;
      }
    });
  }

}

exports.default = Proxy;