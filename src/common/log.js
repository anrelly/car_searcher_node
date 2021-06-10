export default class Log{
    constructor(request,settings){
        this.request=request;
        this.settings=settings;
    }  
   error(message){
       let tmp={
         "bot_id":this.settings.bot.id,
	"bot_pid":this.settings.bot.pid,
	"status":"0",
	"type_message":"error",
	"message" : JSON.stringify(message)  
       }
       this.request.post(`${this.settings.hostController}add-bot-log`,tmp);
   }
   info(message){
        let tmp={
         "bot_id":this.settings.bot.id,
	"bot_pid":this.settings.bot.pid,
	"status":"1",
	"type_message":"info",
	"message" : JSON.stringify(message)  
       }
       this.request.post(`${this.settings.hostController}add-bot-log`,tmp);
   }
   success(message){
        let tmp={
         "bot_id":this.settings.bot.id,
	"bot_pid":this.settings.bot.pid,
	"status":"1",
	"type_message":"success",
	"message" : JSON.stringify(message)  
       }
       this.request.post(`${this.settings.hostController}add-bot-log`,tmp);
   }
    
}


