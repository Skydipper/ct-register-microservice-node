const fs = require('fs');
const debug = require('debug')('ct-register-microservice-node');
const DEFAULT_PATH = `${process.cwd()}/control-tower.config`;

class DataService {

    static saveData(apiGatewayUrl, token) {
        debug('Saving data');
        const data = {
            url: apiGatewayUrl,
            token,
        };
        fs.writeFileSync(DEFAULT_PATH, JSON.stringify(data));
    }

    static getData() {
        debug('Obtaining data');
        const stringData = fs.readFileSync(DEFAULT_PATH);
        if (stringData) {
            return JSON.parse(stringData);
        }
        debug('Data is null');
        return null;
    }

}

module.exports = DataService;
