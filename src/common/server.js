import Express from 'express';

export default class Server{
        constructor(settings,parser,log){
          this.settings=settings; 
          this.parser=parser;
          this.log=log;
          this.app = Express();
          
          this.app.listen(this.settings.bot.port);
          this.app.use( Express.json());
          
          let self = this;
          this.app.use(function (req, res, next) {  
            if (req.ip.indexOf(self.settings.controller.ip)===-1) {   
                self.log.error({message:'IP не найдено', ip:req.ip});
                res.status(401);
                return res.send('Permission denied');
            }
                next(); // correct IP address, continue middleware chain
            });
          this.listen();
            
        }
        listen(){
            let self=this;

            this.app.post('/request', function (req, res) {
                //console.log('body.input: '+req.body.input);
                res.status(200).json({
                    accepted: 1, 
                    iteration_id: req.body.iteration_id,
                    request_id: req.body.request_id,
                });
              // console.log(JSON.stringify({order:req.body}));
                
                self.parser.order(req.body);

            });

            this.app.get('/is_run', function (req, res) {
                res.status(200).json({
                    run: 1, 
                });  
            });
            
         
        }

}


