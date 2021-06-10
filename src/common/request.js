import Axios from 'axios';

 class Request{
        constructor(axios){
           this.axios=axios; 
        }
        
    async post(url,obj){     
//    try {
//        const response = await this.axios.post(url,obj)
//        return {status: true,response:response.data};
//    } catch (error) {
//        return {status: false,response:error.response.data};
//    }      
        const rez = await this.axios.post(url,obj)
        .then(function (response) {
            return {status: true, code: response.status, response:response.data};
        })
        .catch(function (error) {            
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
//              console.log(error.response.data);
//              console.log(error.response.status);
//              console.log(error.response.headers);
              return {status: false, code: error.response.status, response:error.response.data};
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log('Error',error.request);
              return {status: false, code: false, response:error.request};
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message);
              return {status: false, code: false, response:error.message};
            }
            //console.log(error.config);
          });
        return rez;  
    } 
 
//    async get(url,obj={}){
//        var str = "?";
//for (var key in obj) {
//    if (str != "?") {
//        str += "&";
//    }
//    str += key + "=" + encodeURIComponent(obj[key]);
//}
//    try {
//    const response = await this.axios.get(`${url}${str != "?"?str:''}`);
//    return {status: true,response:response.data};
//  } catch (error) {
//    return {status: false,response:error.response.data};
//  }      
// }

    /**
     * 
     * @param {type} url
     * @param {type} requestParams
     * @param {type} proxyParams {host: proxyHost, port: proxyPort, auth: {username: username, password: password}
     * @returns {Request.get.requestAnonym$6|Request.get.requestAnonym$5}
     */
    async get(url, requestParams={}, proxyParams={}, description={}){
        let params = {};
        if(Object.keys(requestParams).length > 0){
            for(var key in requestParams) {
                params[key] = requestParams[key];
            }
        }

        let proxy = false;
        if( Object.keys(proxyParams).length > 0){
            if(proxyParams.hasOwnProperty('host') && proxyParams.hasOwnProperty('port')){
                proxy.host = proxyParams.proxy_host;
                proxy.port = proxyParams.proxy_port;
                if(proxyParams.service_user != null && proxyParams.service_user!='' && proxyParams.service_password!= null && proxyParams.service_password != '') {
                    proxy.auth.username = proxyParams.service_user;
                    proxy.auth.password = proxyParams.service_password;
                }
            }
        }

//        try {
//            const response = await this.axios.get(url, {params:params, proxy:proxy});
//            return {status: true, response: response.data, description:description};
//        } catch (error) {
//            return {status: false, response: error.response.data, description:description};
//        }
        const res = await this.axios.get(url, {params:params, proxy:proxy})
            .then(function (response) {
                return {status: true, code: response.status, response: response.data, description:description};
            })
            .catch(function (error) {
                //return {status: false, response: error, description:description};
                if (error.response) {  // The request was made and the server responded with a status code that falls out of the range of 2xx
                    return {status: false, code: error.response.status, response: error.response.data, description:description};
                }
                else if (error.request) { // The request was made but no response was received
                    return {status: false, code: 0, response: error.request, description:description};
                }
                else { // Something happened in setting up the request that triggered an Error
                    return {status: false, code: false, response: error.message, description:description};
                }
           });
        return res;
    }
}

export default new Request(Axios);


