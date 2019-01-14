# Control Tower microservice utility for Nodejs applications

Library to register and integrate microservice in the [Control Tower](https://github.com/control-tower/control-tower) API gateway. This library implement the `/info` and `/ping` endpoints that Control Tower uses to obtain info of the registered microservices and check live.

Supports [Koa](https://koajs.com/) 2.x and 1.x frameworks. 

## Install

````
npm install --save ct-register-microservice-node
````

## Use in microservice

In the `listen` callback of your Koa application, add the following code snippet:

```javascript
    const promise = require('ct-register-microservice-node').register({
        info: info,
        swagger: swagger,
        logger: logger, 
        app: app,
        mode: 'auto',
        framework: ctRegisterMicroservice.KOA2,
        token: '<your control tower token>',
        ctUrl: '<your control tower instance URL>'
    });
    p.then(function() {}, function(err) {
        logger.error(err);
        process.exit(1);
    });
```

## TODO
- Properly document config options
