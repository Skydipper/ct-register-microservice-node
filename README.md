# ct-register-microservice-node
Library to register microservice in the control-tower api-gateway. This library implement the /info and /ping endpoint that the control-tower uses to obtain info of the registered microservices and check live.


## Install
````
npm install --save ct-register-microservice-node
````

## Use in microservice
In listen callback of koajs app add the next code:
````
    var promise = require('ct-register-microservice-node').register({
        info: info,
        swagger: swagger,
        logger: logger, 
        app: app
        mode: 
        framework:
        token: 
        ctUrl:
    });
    p.then(function() {}, function(err) {
        logger.error(err);
        process.exit(1);
    });
````
