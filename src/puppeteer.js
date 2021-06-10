const { exec } = require("child_process");

exec("pm2 restart all", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});

/*const puppeteer = require('puppeteer');

const arUrl = [
    'https://www.wildberries.ru/catalog/9219814/detail.aspx?targetUrl=GP',
    'https://www.wildberries.ru/catalog/14132379/detail.aspx?targetUrl=GP',
    'https://www.wildberries.ru/catalog/13625505/detail.aspx?targetUrl=GP',
    'https://www.wildberries.ru/catalog/9229814/detail.aspx?targetUrl=GP',
    'https://www.wildberries.ru/catalog/14332379/detail.aspx?targetUrl=GP',
    'https://www.wildberries.ru/catalog/13425505/detail.aspx?targetUrl=GP',
    'https://www.wildberries.ru/catalog/9259814/detail.aspx?targetUrl=GP',
    'https://www.wildberries.ru/catalog/14632379/detail.aspx?targetUrl=GP',
    'https://www.wildberries.ru/catalog/13725505/detail.aspx?targetUrl=GP'
];

(async () => {
    
    for(let url of arUrl){
        const browser = await puppeteer.launch({
            headless: true,
            ignoreHTTPSErrors: true,
            args: [
                '--disable-setuid-sandbox',
                '--disable-gpu',
                '--no-first-run',
                '--no-sandbox',
                '--window-size=1920x1080',
                '--disable-web-security',
                `--proxy-server=185.89.101.208:8080`
            ]
        });
        
        const page = await browser.newPage();              
        await page.authenticate({ username: 'RUS359015', password: '2tPxDb4nbK' });                               
        await page.goto(url,{
            waitUntil: ['networkidle0', 'domcontentloaded'],
            timeout: 60000//30000
        });
        //let content = await page.content();
        try{
        let tt  =  await page.$eval('.j-product-title', el => el.innerText);// await page.$eval('.j-product-title');
         console.log(tt);
        }catch(e){
            console.log('catch');
        }
       
//        await page.close();
        await browser.close();
    }
    
})();

*/
//
////const puppeteer = require('puppeteer');
//const puppeteer_proxy = require('puppeteer-proxy');
//const useProxy = require('puppeteer-page-proxy');
//
//
//
//
//var http = require ('http');
//
//http.get ({
////    host: '185.89.101.208',
////    port: 8080,
//    path: 'https://www.wildberries.ru/catalog/13625505/detail.aspx?targetUrl=GP',
////    headers:    {
////        'Proxy-Authorization':  'Basic ' + new Buffer.from('RUS359015:2tPxDb4nbK').toString('base64')
////    }
//}, function (response) {
//    console.log (response);
//});
//
//
//
//const arUrl = [
//    'https://www.wildberries.ru/catalog/9219814/detail.aspx?targetUrl=GP',
//    'https://www.wildberries.ru/catalog/14132379/detail.aspx?targetUrl=GP',
//    'https://www.wildberries.ru/catalog/13625505/detail.aspx?targetUrl=GP'
//];
//
//
//
//async function run(arUrl){
//    const cheerio = require('cheerio');
//    try{
//        const browser = await puppeteer.launch({
//            headless: true,
//            ignoreHTTPSErrors: true,
//            args: [
//                '--no-sandbox',              
//                '--disable-gpu',
//                '--window-size=1920x1080',
//                //'--proxy-server=185.89.101.208:8080'
//            ]
//        });
//        
//        for await (let url of arUrl){
//            const page = await browser.newPage();
////            page.setRequestInterception(true)
////            page.on("request", r => r.continue())
////            await page.authenticate({
////            username: 'RUS359015',
////            password: '2tPxDb4nbK',
////            });
////             await page.setExtraHTTPHeaders({
////                'Proxy-Authorization': 'Basic ' + Buffer.from('RUS359015:2tPxDb4nbK').toString('base64'),
////            });
////            await page.setRequestInterception(true);
////            page.on('request', async request => {
////                await useProxy(request, 'http://185.89.101.208:8080');
////            });
////            page.on('request', async request => {
////                await useProxy(request, {
////                    proxy: 'http://185.89.101.208:8080',
////                    url: 'https://www.wildberries.ru/catalog/13625505/detail.aspx?targetUrl=GP',
////                    method: 'GET',
////                    postData: '404',
////                    headers: {
////                        accept: 'text/html',
////                        'Proxy-Authorization': 'Basic ' + Buffer.from('RUS359015:2tPxDb4nbK').toString('base64'),
////                    }
////                });
////            });
//
////            await page.setRequestInterception(true); 
////              page.on('request', async (request) => {
//////                await puppeteer_proxy.proxyRequest({
//////                  page,
//////                  proxyUrl: 'http://RUS359015:2tPxDb4nbK@185.89.101.208:8080',
//////                  request,
//////                });
////                console.log(request);
////                request.continue()
////              });
//
//            await page.goto(url,{
//                waitUntil: ['networkidle0', 'domcontentloaded'],
//                //timeout: 0
//            });
//            let res = await page.content();
//            const $ = cheerio.load(res, {normalizeWhitespace: true,decodeEntities: false});
//            console.log($('div.brand-and-name.j-product-title').text());
//
////            let tmp = ['30790713','30790714','30790715','30790716','30790717'];
////            for(let id of tmp){
////                const element1 = await page.$('div.j-size-list label[data-characteristic-id="'+id+'"]>span');
////                await element1.click();
////                const content1 = await page.content();
////                const $1 = cheerio.load(content1, {normalizeWhitespace: true,decodeEntities: false});
////                console.log($1('.tooltipster-base').length, $1('.tooltipster-base').text());
////            }
//        }
//        
//    
//        await browser.close();
//    }
//    catch(e){
//        console.log(e);
//    }
//    
////    let poolPromises=[];
////    for  (let url of arUrl){
////        init(url);
////        
////    }
//    
////    Promise.allSettled(poolPromises)
////        .then(results => { 
////            results.forEach((promise, num) => {
////                if (promise.status == "fulfilled") {
////                    console.log('fulfilled');
//////                    poolResponce.responce.push(self.responceHandler(promise.value, obj.search));
////                }
////                if (promise.status == "rejected") {
////                    console.log('rejected');
////                    console.log(promise.reason);
////                }
////            });
////    });
//}
//
//async function init(url){
//    try{
//        const browser = await puppeteer.launch({
//            headless: true,
//            ignoreHTTPSErrors: true,
//            args: [
//                '--no-sandbox',              
//                '--disable-gpu',
//                '--window-size=1920x1080'
//            ]
//        });
//        const page = await browser.newPage();
//        page.setRequestInterception(true)
//        page.on("request", r => r.continue())
//        await page.goto(url,{
//            waitUntil: ['networkidle0', 'domcontentloaded'],
//            //timeout: 30000
//        });
//        let res = await page.content();
//        console.log(res);
//        await browser.close();
//    }
//    catch(e){
//        console.log(e);
//    }
//}
//
//
//
//run(arUrl);







const url = 'https://www.wildberries.ru/catalog/9219814/detail.aspx?targetUrl=GP';

async function pp(u){
    const cheerio = require('cheerio');
    try{
        const browser = await puppeteer.launch({
            headless: true,
            ignoreHTTPSErrors: true,
            args: [
                '--no-sandbox',              
                '--disable-gpu',
                '--window-size=1920x1080'
            ]
        });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
        await page.goto(u,{
            waitUntil: ['networkidle0', 'domcontentloaded'],
            //timeout: 30000
        });

//        await page.$eval('p.sizes-table-show', el => el.click());
       // await page.$eval('div.j-size-list label[data-characteristic-id="30790713"]>span', el => el.click());
        const content = await page.content();
        //console.log(content);
        
       
        
  

    let tmp = ['30790713','30790714','30790715','30790716','30790717'];
for(let id of tmp){
    const element1 = await page.$('div.j-size-list label[data-characteristic-id="'+id+'"]>span');
    await element1.click();
    const content1 = await page.content();
    const $1 = cheerio.load(content1, {normalizeWhitespace: true,decodeEntities: false});
    console.log($1('.tooltipster-base').length, $1('.tooltipster-base').text());
}
//    const element1 = await page.$('div.j-size-list label[data-characteristic-id="30790714"]>span');
//    await element1.click();
//    const content1 = await page.content();
//    const $1 = cheerio.load(content1, {normalizeWhitespace: true,decodeEntities: false});
//    console.log($1('.tooltipster-base').length, $1('.tooltipster-base').text());
    
     
    
//const element = await page.$('div.j-size-list label[data-characteristic-id="30790713"]>span');
//    await element.click();
//    const content = await page.content();
        //  console.log(element);
        
        
        const $ = cheerio.load(content, {normalizeWhitespace: true,decodeEntities: false});
        
        console.log($('.tooltipster-base').length, $('.tooltipster-base').text());
        
//        let sizesTable = {};
//        $('#sizes-info-popup #tab-sizes table').each(function(tableIndex, table){
//            if(!sizesTable.hasOwnProperty(tableIndex)){
//                sizesTable[tableIndex] = {};
//            }
//            $(table).find('tr').each(function(trIndex, tRow){
//                let row=[];
//                $(tRow).find('td').each(function(){                
//                    row.push($(this).text().trim());
//                });
//                if(!sizesTable[tableIndex].hasOwnProperty(trIndex)){
//                    sizesTable[tableIndex][trIndex] = null;
//                }
//                sizesTable[tableIndex][trIndex] = row;
//            });
//        });
//        console.log(sizesTable);
        
//        console.log('relatedGoodsWrapper: ');
//        $('#relatedGoodsWrapper').siblings('div[data-recommendation-model]').find('div.item.j-product-item a').each(function(){
//            console.log($(this).attr('href'));
//        });      
          
//        console.log('similar-goods-wrapper: ');
//        $('.similar-goods-wrapper').not('.also-buy-wrapper').find('div.i-slider-gallery.j-slider-gallery div.item.j-product-item a').each(function(){
//            console.log($(this).attr('href'));
//        });
        
//        console.log('.also-buy-wrapper: ');
//        $('.similar-goods-wrapper.also-buy-wrapper').find('div.i-slider-gallery.j-slider-gallery div.item.j-product-item a').each(function(){
//            console.log($(this).attr('href'));
//        });
        
        await browser.close();
    }
    catch(e){
        console.log(e);
    }
}

//pp(url);

async function gt( page, id){
    const cheerio = require('cheerio');
    const element1 = await page.$('div.j-size-list label[data-characteristic-id="'+id+'"]>span');
    await element1.click();
    const content1 = await page.content();
    const $1 = cheerio.load(content1, {normalizeWhitespace: true,decodeEntities: false});
    console.log($1('.tooltipster-base').length, $1('.tooltipster-base').text());
}