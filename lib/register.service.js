const debug = require('debug')('ct-register-microservice-node');
const requestPromise = require('request-promise');

class RegisterService {

    static register(name, url, active, ctUrl) {
        debug('Doing request to /api/v1/microservice');
        const promise = requestPromise({
            uri: `${ctUrl}/api/v1/microservice`,
            json: {
                name,
                url,
                active,
            },
            method: 'POST',
        });
        return promise;
    }

}

module.exports = RegisterService;
