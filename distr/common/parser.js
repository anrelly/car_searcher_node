"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const puppeteer = require('puppeteer');

const cheerio = require('cheerio');

class parser {
  constructor(request, botSettings, log, proxy) {
    this.request = request;
    this.settings = botSettings;
    this.log = log;
    this.proxy = proxy;
  }

  order(obj = {}) {
    let poolPromises = [];
    let self = this;
    obj.input.forEach(function (item) {
      poolPromises.push(self.exec(item, obj));
    });
    Promise.allSettled(poolPromises).then(results => {
      let poolResponce = {
        identity: {
          request_id: obj.request_id,
          iteration_id: obj.iteration_id
        },
        responce: []
      };
      results.forEach((promise, num) => {
        if (promise.status == "fulfilled") {
          poolResponce.responce.push(self.responceHandler(promise.value, obj.search));
        }

        if (promise.status == "rejected") {//////console.log('rejected');
          //////console.log(promise.reason);
        }
      });
      let iteration_request = obj.request_id + '_' + obj.iteration_id; //self.sendSrcParsePageData(poolResponce, iteration_request);
      // console.log(JSON.stringify({simplePost:poolResponce}));

      self.simplePost(poolResponce);
    });
  } //------------------------------------------------------------------------------


  responceHandler(response, objSearch) {
    let self = this;
    let rez = {};
    rez = {
      status: response.status,
      code: response.code
    };
    self.fillDescriptions(rez, response.description);

    if (response.status == true) {
      self.fillParseData(rez, response.response, objSearch);
    }

    return rez;
  }

  fillDescriptions(source, description) {
    for (const [dKey, dValue] of Object.entries(description)) {
      if (!source.hasOwnProperty(dKey)) {
        source[dKey] = '';
      }

      source[dKey] = dValue;
    }
  }

  fillParseData(source, html, obj) {
    const $ = cheerio.load(html, {
      normalizeWhitespace: true,
      decodeEntities: false
    });
    let self = this;

    for (const [key, value] of Object.entries(obj)) {
      if (value.hasOwnProperty('selector') && value.hasOwnProperty('function')) {
        if (!source.hasOwnProperty(key)) {
          source[key] = {};
        }

        for (const [fName, fArg] of Object.entries(value.function)) {
          $(value.selector).each(function (i, elem) {
            if (!source[key].hasOwnProperty(i)) {
              source[key][i] = {};
            }

            let curNode = $(this);
            let propName = fName + (fArg == '' ? '' : '-' + fArg);

            if (Array.isArray(fArg)) {
              fArg.forEach(function (arg) {
                propName = fName + '-' + arg;
                source[key][i][propName] = self.execParsingFunction(curNode, fName, arg);
              });
            } else {
              source[key][i][propName] = self.execParsingFunction(curNode, fName, fArg);
            }
          });
        }
      }
    }
  } //------------------------------------------------------------------------------


  async exec(url, obj) {
    let proxyData = await this.proxy.getProxy();
    let proxy = {};

    if (proxyData.status == 1) {
      proxy = proxyData.proxy;
    }

    let description = {
      level: obj.level,
      parent: obj.parent,
      page_url: url,
      request_id: obj.request_id,
      iteration_id: obj.iteration_id,
      created: this.getTimeStampFormated()
    }; // console.log('send_url: '+url);              

    return this.request.get(url, {}, proxy, description);
  }

  parserProcess(html, obj, description) {
    const $ = cheerio.load(html, {
      normalizeWhitespace: true,
      decodeEntities: false
    });
    let rez = {};
    let self = this;

    for (const [key, value] of Object.entries(obj)) {
      if (value.hasOwnProperty('selector') && value.hasOwnProperty('function')) {
        if (!rez.hasOwnProperty(key)) {
          rez[key] = {};
        }

        for (const [fName, fArg] of Object.entries(value.function)) {
          $(value.selector).each(function (i, elem) {
            if (!rez[key].hasOwnProperty(i)) {
              rez[key][i] = {};
            }

            let curNode = $(this);
            let propName = fName + (fArg == '' ? '' : '-' + fArg);

            if (Array.isArray(fArg)) {
              fArg.forEach(function (arg) {
                propName = fName + '-' + arg;
                rez[key][i][propName] = self.execParsingFunction(curNode, fName, arg);
              });
            } else {
              rez[key][i][propName] = self.execParsingFunction(curNode, fName, fArg);
            }
          });
        }
      }
    }

    for (const [dKey, dValue] of Object.entries(description)) {
      if (!rez.hasOwnProperty(dKey)) {
        rez[dKey] = '';
      }

      rez[dKey] = dValue;
    }

    return rez;
  } //------------------------------------------------------------------------------      


  execParsingFunction(node, func, arg) {
    let rez = null;

    if (['text', 'html'].includes(func)) {
      rez = node[func]().trim();
    } else {
      rez = node[func](arg);
    }

    return rez;
  } //------------------------------------------------------------------------------    


  getTimeStampFormated() {
    let formatedMysqlString = new Date(new Date(new Date(new Date()).toISOString()).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 19).replace('T', ' ');
    return formatedMysqlString;
  } //------------------------------------------------------------------------------


  async sendSrcParsePageData(sendData, iteration_request, obclass = false) {
    if (!obclass) {
      obclass = this;
    }

    const send = await obclass.request.post(`${obclass.settings.hostController}receive-parse-data`, sendData).then(function (res) {
      // //////console.log(res);
      if (res.status == true) {//     //////console.log('send_api_success: '+iteration_request, 'code: '+res.code); 
      } else {//     //////console.log('send_api_error: '+iteration_request, 'code: '+res.code);
          //setTimeout(obclass.sendSrcParsePageData, obclass.randomNumber(100,1000), sendData, iteration_request, obclass);
        }
    }); //        if(send.status == true){
    //            //////console.log('send_api_success: '+iteration_request, 'code: '+send.code);                    
    //        }
    //        else{
    //            //////console.log('send_api_error: '+iteration_request, 'code: '+send.code);
    ////            this.sendSrcParsePageData(sendData);
    //
    //            setTimeout(obclass.sendSrcParsePageData, obclass.randomNumber(100,1000), sendData, iteration_request, obclass);
    //        }
  }

  randomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }

  simplePost(dataSend, obclass = false) {
    if (!obclass) {
      obclass = this;
    }

    const http = require('http');

    const data = JSON.stringify(dataSend);
    const data2 = data.replace(/[\u007F-\uFFFF]/g, function (chr) {
      return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4);
    });
    const options = {
      auth: `${obclass.settings.controller.user}:${obclass.settings.controller.password}`,
      hostname: `${obclass.settings.controller.host}`,
      port: 80,
      path: `${obclass.settings.controller.api}receive-parse-data`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': data2.length
      }
    }; //  console.log(JSON.stringify({razd:'**********************************************************************************',optionPost:options,dataPost:data}));

    const req = http.request(options, res => {
      ////////console.log(`statusCode: ${res.statusCode}`)
      res.on('data', d => {
        process.stdout.write(d);

        if (d == '-2') {
          console.log(data2);
        }
      });

      if (res.statusCode >= 200 && res.statusCode < 400) {// console.log('send_api_success ', 'code: '+res.statusCode);                    
      } else {
        console.log('send_api_error ', 'code: ' + res.statusCode); // setTimeout(obclass.simplePost, obclass.randomNumber(100,1000), dataSend, obclass);
      }
    });
    req.on('error', error => {
      console.log(error);
    });
    req.write(data2);
    req.end();
  } //------------------------------------------------------------------------------


  async execGoods(url, obj) {
    let proxyData = await this.proxy.getProxy();

    try {
      const browser = await puppeteer.launch({
        headless: true,
        ignoreHTTPSErrors: true,
        args: ['--disable-extensions', '--disable-setuid-sandbox', '--disable-gpu', '--no-first-run', '--no-sandbox', '--window-size=1920x1080', '--disable-web-security', `--proxy-server=${proxyData.proxy.proxy_host}:${proxyData.proxy.proxy_port}`]
      });
      const page = await browser.newPage();
      await page.authenticate({
        username: proxyData.proxy.service_user,
        password: proxyData.proxy.service_password
      });
      await page.goto(url, {
        waitUntil: ['networkidle0', 'domcontentloaded'],
        timeout: 60000 //30000

      }); //await browser.close();

      let description = {
        level: obj.level,
        parent: obj.parent,
        page_url: url,
        request_id: obj.request_id,
        iteration_id: obj.iteration_id,
        created: this.getTimeStampFormated()
      };
      return {
        page: page,
        browser: browser,
        description: description
      };
    } catch (e) {
      //////console.log(e);
      //////console.log('SEND ERROR FROM PUPPETEER');
      return false;
    }
  } //------------------------------------------------------------------------------


  async processingGoodsResponce(poolRresponce, obj) {
    //        const cheerio = require('cheerio');
    let self = this;
    let poolRez = {
      identity: {
        request_id: obj.request_id,
        iteration_id: obj.iteration_id
      },
      responce: []
    };

    try {
      for await (const [num, promise] of Object.entries(poolRresponce)) {
        if (promise.status == "fulfilled") {
          const page = promise.value.page;
          const browser = promise.value.browser;
          const description = promise.value.description;
          let rez = {
            status: true,
            code: 200
          }; // set Descriptions

          self.fillDescriptions(rez, description); // simple props

          let defHtml = await page.content();
          self.fillParseData(rez, defHtml, obj.search); // set browser props

          if (obj.hasOwnProperty('browserSearch') && Object.entries(obj.browserSearch).length > 0) {
            for (const [type, obType] of Object.entries(obj.browserSearch)) {
              switch (type) {
                case 'lazyBlock':
                  // from lazy props
                  self.fillParseFromLazy(rez, defHtml, obType);
                  break;

                case 'itemTableSizes':
                  // from click sizes table
                  self.fillParseFromTableSizes(rez, page, obType, type);
                  break;
              }
            }
          } // goodsBalance


          if (rez.hasOwnProperty('itemSizes') && Object.entries(rez['itemSizes']).length > 0) {
            if (obj.hasOwnProperty('browserSearch') && Object.entries(obj.browserSearch).length > 0 && Object.entries(obj.browserSearch.itemGoodsBalance).length > 0) {
              let params = obj.browserSearch.itemGoodsBalance;
              let goodsBalance = '';

              for await (const [n, itemSize] of Object.entries(rez['itemSizes'])) {
                if (!rez['itemSizes'][n].hasOwnProperty('goodsBalance')) {
                  rez['itemSizes'][n]['goodsBalance'] = goodsBalance;
                }

                if (itemSize['hasClass-disabled'] == false) {
                  let charId = itemSize['attr-data-characteristic-id'];
                  let elSelector = params.browserSelector.replace(/{charId}/, charId);
                  const element1 = await page.$(`${elSelector}`);
                  await element1.click();
                  const content1 = await page.content();
                  const $1 = cheerio.load(content1, {
                    normalizeWhitespace: true,
                    decodeEntities: false
                  });
                  let node = $1(params.selector);

                  for (const [func, arg] of Object.entries(params.function)) {
                    goodsBalance = self.execParsingFunction(node, func, arg);
                  }

                  rez['itemSizes'][n]['goodsBalance'] = goodsBalance;
                }
              }
            }
          } //////console.log(rez);


          poolRez.responce.push(rez);
          await browser.close();
        }

        if (promise.status == "rejected") {//////console.log('rejected');
          //////console.log(promise.reason);
        }
      }
    } catch (e) {//////console.log('SEND ERROR FROM processingGoodsResponce');
      //////console.log(e);
    }

    return poolRez;
  } //------------------------------------------------------------------------------


  fillParseFromLazy(source, html, search) {
    //        const cheerio = require('cheerio');
    const $ = cheerio.load(html, {
      normalizeWhitespace: true,
      decodeEntities: false
    });
    let self = this;

    for (const [key, value] of Object.entries(search)) {
      if (!source.hasOwnProperty(key)) {
        source[key] = {};
      }

      for (const [fName, fArg] of Object.entries(value.function)) {
        let htmlNode = $('html');
        let node = self.combimeChainSelector(htmlNode, value.selector);
        node.each(function (i, elem) {
          if (!source[key].hasOwnProperty(i)) {
            source[key][i] = {};
          }

          let curNode = $(this);
          let propName = fName + (fArg == '' ? '' : '-' + fArg);

          if (Array.isArray(fArg)) {
            fArg.forEach(function (arg) {
              propName = fName + '-' + arg;
              source[key][i][propName] = self.execParsingFunction(curNode, fName, arg);
            });
          } else {
            source[key][i][propName] = self.execParsingFunction(curNode, fName, fArg);
          }
        });
      }
    }
  } //------------------------------------------------------------------------------


  combimeChainSelector(htmlNode, obSelector) {
    let node = htmlNode;

    for (const [num, step] of Object.entries(obSelector)) {
      node = node[step.function](step.selector);
    }

    return node;
  } //------------------------------------------------------------------------------


  async fillParseFromTableSizes(source, page, params, type) {
    let self = this;

    try {
      await page.evaluate((selector, obBrowserAction) => {
        for (const [fName, fArg] of Object.entries(obBrowserAction)) {
          document.querySelector(selector)[fName](fArg);
        }
      }, params.browserSelector, params.browserAction);
      const contentSizesTable = await page.content();
      const $ = cheerio.load(contentSizesTable, {
        normalizeWhitespace: true,
        decodeEntities: false
      });
      let sizesTable = {};
      $(params.selector).each(function (tableIndex, table) {
        if (!sizesTable.hasOwnProperty(tableIndex)) {
          sizesTable[tableIndex] = {};
        }

        $(table).find('tr').each(function (trIndex, tRow) {
          let row = [];
          $(tRow).find('td').each(function () {
            let curNode = $(this);

            for (const [func, arg] of Object.entries(params.function)) {
              row.push(self.execParsingFunction(curNode, func, arg));
            }
          });

          if (!sizesTable[tableIndex].hasOwnProperty(trIndex)) {
            sizesTable[tableIndex][trIndex] = null;
          }

          sizesTable[tableIndex][trIndex] = row;
        });
      });

      if (!source.hasOwnProperty(type)) {
        source[type] = {};
      }

      source[type] = sizesTable;
    } catch (e) {}
  } //------------------------------------------------------------------------------


  async getGoods(obj, storage) {
    let self = this;
    let hasError = false;

    for (let url of obj.input) {
      let proxyData = await self.proxy.getProxy();
      let pageRez = {
        status: null,
        code: null,
        level: obj.level,
        parent: obj.parent,
        page_url: url,
        request_id: obj.request_id,
        iteration_id: obj.iteration_id,
        created: self.getTimeStampFormated()
      };

      try {
        const browser = await puppeteer.launch({
          headless: true,
          ignoreHTTPSErrors: true,
          args: ['--disable-setuid-sandbox', '--disable-gpu', '--no-first-run', '--no-sandbox', '--window-size=1920x1080', '--disable-web-security', `--proxy-server=${proxyData.proxy.proxy_host}:${proxyData.proxy.proxy_port}`]
        });
        const page = await browser.newPage();
        await page.authenticate({
          username: proxyData.proxy.service_user,
          password: proxyData.proxy.service_password
        });
        const response = await page.goto(url, {
          waitUntil: ['networkidle0', 'domcontentloaded'],
          timeout: 40000
        });
        let respHeaders = response.headers();
        pageRez.code = respHeaders.status;

        if (pageRez.code >= 200 && pageRez.code < 400) {
          pageRez.status = true;
          let defHtml = await page.content();
          self.fillParseData(pageRez, defHtml, obj.search); // set browser props

          if (obj.hasOwnProperty('browserSearch') && Object.entries(obj.browserSearch).length > 0) {
            for await (const [type, obType] of Object.entries(obj.browserSearch)) {
              switch (type) {
                case 'lazyBlock':
                  // from lazy props
                  self.fillParseFromLazy(pageRez, defHtml, obType);
                  break;

                case 'itemTableSizes':
                  // from click sizes table
                  self.fillParseFromTableSizes(pageRez, page, obType, type);
                  break;
              }
            }
          } // goodsBalance


          if (pageRez.hasOwnProperty('itemSizes') && Object.entries(pageRez['itemSizes']).length > 0) {
            if (obj.hasOwnProperty('browserSearch') && Object.entries(obj.browserSearch).length > 0 && Object.entries(obj.browserSearch.itemGoodsBalance).length > 0) {
              let params = obj.browserSearch.itemGoodsBalance;
              let goodsBalance = '';

              for await (const [n, itemSize] of Object.entries(pageRez['itemSizes'])) {
                if (!pageRez['itemSizes'][n].hasOwnProperty('goodsBalance')) {
                  pageRez['itemSizes'][n]['goodsBalance'] = goodsBalance;
                }

                if (itemSize['hasClass-disabled'] == false) {
                  let charId = itemSize['attr-data-characteristic-id'];
                  let elSelector = params.browserSelector.replace(/{charId}/, charId);
                  await page.evaluate((selector, obBrowserAction) => {
                    for (const [fName, fArg] of Object.entries(obBrowserAction)) {
                      document.querySelector(selector)[fName](fArg);
                    }
                  }, elSelector, params.browserAction);
                  const content1 = await page.content();
                  const $1 = cheerio.load(content1, {
                    normalizeWhitespace: true,
                    decodeEntities: false
                  });
                  let node = $1(params.selector);

                  for (const [func, arg] of Object.entries(params.function)) {
                    goodsBalance = self.execParsingFunction(node, func, arg);
                  }

                  pageRez['itemSizes'][n]['goodsBalance'] = goodsBalance;
                }
              }
            }
          }
        } else {
          pageRez.status = false;
        }

        storage.push(pageRez);
        await browser.close();
      } catch (e) {
        hasError = true;
        break;
      }
    } //////console.log(' storage.length =  '+storage.length);


    return hasError ? false : true;
  }

}

exports.default = parser;