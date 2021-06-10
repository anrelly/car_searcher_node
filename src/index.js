
import Request from './common/request';
import Proxy from './common/proxy';
import Settings from './common/settings';
import Log from './common/log';
import Parser from './common/parser';
import Server from './common/server';
//import Net from 'net';

async   function start(){       
   const botSettings=new Settings(Request); 
    const log= new Log(Request,botSettings);
    let proxy= new Proxy(Request,botSettings,log);
    proxy= await proxy.setProxyList();
    const parser =new Parser(Request,botSettings,log,proxy);  
  const server=new Server(botSettings,parser,log);
  
  process.on('SIGINT',()=>{
    //  console.log('ghghghghgg');
      log.info({mess:'kill'});
      
  });
  
}

 start();
 
 








