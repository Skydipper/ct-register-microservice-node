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

    * registerKoa1(info, swagger, next) {
        if (this.path === '/info') {
            logger.info('Obtaining info to register microservice with token %s and url %s', this.query.token, this.query.url);
            info.swagger = swagger;
            // save token and url
            this.body = info;
            return;
        } else if (this.path === '/ping') {
            this.body = 'pong';
            return;
        }
        yield next;
    }

    register(opts) {
        this.options = opts;
        return new Promise((resolve, reject) => {
            logger = opts.logger || defaultLogger;
            logger.info('Initializing register microservice');
            switch (opts.framework) {

            case KOA1:
                opts.app.use(function * (next) {
                    yield Microservice.registerKoa1.bind(this, opts.info, opts.swagger, next);
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

    static get KOA2() {
        return KOA2;
    }

    static get KOA1() {
        return KOA1;
    }

    static get EXPRESS() {
        return EXPRESS;
    }

    static get MODE_AUTOREGISTER() {
        return MODE_AUTOREGISTER;
    }

    static get MODE_NORMAL() {
        return MODE_NORMAL;
    }

}

module.exports = new Microservice();
