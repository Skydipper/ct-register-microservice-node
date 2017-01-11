const debug = require('debug')('ct-register-microservice-node');
const requestPromise = require('request-promise');
const RegisterService = require('./register.service');
const Promise = require('bluebird');

const KOA1 = 'KOA1';
const KOA2 = 'KOA2';
const EXPRESS = 'EXPRESS';
const MODE_AUTOREGISTER = 'MODE_AUTOREGISTER';
const MODE_NORMAL = 'MODE_NORMAL';

const defaultLogger = {
    debug,
    error: debug,
    warn: debug,
    info: debug,
};

let logger = defaultLogger;

class Microservice {

    * registerKoa1(ctx, info, swagger, next) {
        if (ctx.path === '/info') {
            logger.info('Obtaining info to register microservice');
            info.swagger = swagger;
            // save token and url
            ctx.body = info;
            return;
        } else if (ctx.path === '/ping') {
            ctx.body = 'pong';
            return;
        }
        yield next;
    }

    async registerKoa2(ctx, info, swagger, next) {
        if (ctx.path === '/info') {
            logger.info('Obtaining info to register microservice');
            info.swagger = swagger;
            // save token and url
            ctx.body = info;
            return;
        } else if (ctx.path === '/ping') {
            ctx.body = 'pong';
            return;
        }
        await next();
    }

    init(opts){
        this.options = opts;
    }

    register(opts) {
        if (opts) {
            this.options = opts;
        }
        return new Promise((resolve, reject) => {
            logger = opts.logger || defaultLogger;
            logger.info('Initializing register microservice');
            const ctxLib = this;
            switch (opts.framework) {

            case KOA1:
                opts.app.use(function * (next) {
                    yield ctxLib.registerKoa1(this, opts.info, opts.swagger, next);
                });
                break;
            case KOA2:
                opts.app.use(async (ctx, next) => {
                    logger.info('Entering with path', ctx.path);
                    await ctxLib.registerKoa2(ctx, opts.info, opts.swagger, next);
                });
                break;
            default:

            }

            logger.debug('Checking mode');
            let promise = null;
            switch (opts.mode) {

            case MODE_AUTOREGISTER:
                promise = RegisterService.register(opts.name, opts.url, opts.active, opts.ctUrl);
                break;
            default:

            }
            if (promise) {
                promise.then(() => {
                    logger.debug('Register microservice complete succesfully!');
                    resolve();
                }, (err) => {
                    logger.error('Error registering', err);
                    reject(err);
                });
            } else {
                logger.debug('Register microservice complete succesfully!');
                resolve();
            }
        });
    }

    requestToMicroservice(config) {
        logger.info('Adding authentication header ');
        try {
            config.headers = Object.assign(config.headers || {}, { authentication: this.options.token });
            config.uri = this.options.ctUrl + config.uri;
            return requestPromise(config);
        } catch (err) {
            logger.error('Error to doing request', err);
            throw err;
        }

    }

    get KOA2() {
        return KOA2;
    }

    get KOA1() {
        return KOA1;
    }

    get EXPRESS() {
        return EXPRESS;
    }

    get MODE_AUTOREGISTER() {
        return MODE_AUTOREGISTER;
    }

    get MODE_NORMAL() {
        return MODE_NORMAL;
    }

}

module.exports = new Microservice();
